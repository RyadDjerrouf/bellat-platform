import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';

const BCRYPT_ROUNDS = 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

interface LoginRecord {
  count: number;
  lockedUntil: Date | null;
}

interface ResetRecord {
  userId: string;
  expiresAt: Date;
}

@Injectable()
export class AuthService {
  // In-memory stores — ephemeral (reset on server restart).
  // TODO: move to Redis (Phase 4) for persistence across restarts.
  private readonly loginAttempts = new Map<string, LoginRecord>();
  private readonly resetTokens = new Map<string, ResetRecord>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly mail: MailService,
  ) {}

  // ── Lockout helpers ──────────────────────────────────────────────────────────

  private checkLockout(email: string): void {
    const record = this.loginAttempts.get(email);
    if (!record?.lockedUntil) return;
    if (record.lockedUntil > new Date()) {
      const remaining = Math.ceil((record.lockedUntil.getTime() - Date.now()) / 60_000);
      throw new UnauthorizedException(
        `Account temporarily locked. Try again in ${remaining} minute${remaining === 1 ? '' : 's'}.`,
      );
    }
    // Lockout expired — clear it
    this.loginAttempts.delete(email);
  }

  private recordFailedAttempt(email: string): void {
    const record = this.loginAttempts.get(email) ?? { count: 0, lockedUntil: null };
    record.count += 1;
    if (record.count >= MAX_LOGIN_ATTEMPTS) {
      record.lockedUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60_000);
      record.count = 0;
    }
    this.loginAttempts.set(email, record);
  }

  private clearAttempts(email: string): void {
    this.loginAttempts.delete(email);
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    let user;
    try {
      user = await this.prisma.user.create({
        data: {
          fullName: dto.fullName,
          email: dto.email,
          phoneNumber: dto.phoneNumber,
          passwordHash,
        },
      });
    } catch (err) {
      // P2002 = unique constraint violation (e.g. phoneNumber already registered)
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        const field = (err.meta?.target as string[])?.join(', ') ?? 'field';
        throw new ConflictException(`A user with this ${field} already exists`);
      }
      throw err;
    }

    // Fire-and-forget welcome email — never block the registration response
    this.mail.sendWelcome(user.email, user.fullName).catch(() => {});

    return this.buildTokenResponse(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    // Check lockout before touching the DB — avoids unnecessary queries
    this.checkLockout(dto.email);

    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) {
      // Record attempt even for unknown emails (prevents timing-based enumeration)
      this.recordFailedAttempt(dto.email);
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) {
      this.recordFailedAttempt(dto.email);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.clearAttempts(dto.email);
    return this.buildTokenResponse(user.id, user.email, user.role);
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Always return the same message — prevents email enumeration
    const SUCCESS_MESSAGE = 'If this email is registered, a reset link has been sent.';

    if (!user) return { message: SUCCESS_MESSAGE };

    // Invalidate any existing token for this user first
    for (const [token, record] of this.resetTokens.entries()) {
      if (record.userId === user.id) this.resetTokens.delete(token);
    }

    const token = randomUUID();
    this.resetTokens.set(token, {
      userId: user.id,
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    });

    await this.mail.sendPasswordReset(email, token);

    return { message: SUCCESS_MESSAGE };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const record = this.resetTokens.get(token);
    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset token.');
    }

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await this.prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    });

    this.resetTokens.delete(token);
    return { message: 'Password reset successfully. Please log in.' };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwt.verify<JwtPayload>(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });
      // Issue a new access token only — refresh token keeps its original expiry
      const accessToken = this.jwt.sign(
        { sub: payload.sub, email: payload.email, role: payload.role },
        { secret: this.config.get('JWT_SECRET'), expiresIn: this.config.get('JWT_EXPIRES_IN') },
      );
      return { accessToken };
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token expired — please log in again');
      }
      if (err instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      throw err;
    }
  }

  private buildTokenResponse(userId: string, email: string, role: string) {
    const payload: JwtPayload = { sub: userId, email, role };

    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN'), // 15m
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'), // 7d
    });

    return { accessToken, refreshToken };
  }
}

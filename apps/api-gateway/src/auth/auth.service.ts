import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { RedisService } from '../redis/redis.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';

const BCRYPT_ROUNDS = 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 15 * 60; // 15 minutes
const RESET_TOKEN_TTL_SECONDS = 60 * 60; // 1 hour

// Redis key helpers
const attemptKey  = (email: string) => `auth:attempts:${email}`;
const lockKey     = (email: string) => `auth:locked:${email}`;
const resetKey    = (token: string) => `auth:reset:${token}`;
const resetUserKey = (userId: string) => `auth:reset_user:${userId}`;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly mail: MailService,
    private readonly redis: RedisService,
  ) {}

  // ── Lockout helpers (Redis-backed) ───────────────────────────────────────────

  private async checkLockout(email: string): Promise<void> {
    const locked = await this.redis.get(lockKey(email));
    if (!locked) return;
    // Key exists and has a TTL — compute remaining time from stored lock timestamp
    const lockedAt = parseInt(locked, 10);
    const remaining = Math.ceil((lockedAt + LOCKOUT_SECONDS * 1000 - Date.now()) / 60_000);
    throw new UnauthorizedException(
      `Account temporarily locked. Try again in ${Math.max(remaining, 1)} minute${remaining === 1 ? '' : 's'}.`,
    );
  }

  private async recordFailedAttempt(email: string): Promise<void> {
    const key = attemptKey(email);
    const raw = await this.redis.get(key);
    const count = raw ? parseInt(raw, 10) + 1 : 1;

    if (count >= MAX_LOGIN_ATTEMPTS) {
      // Lock the account — key auto-expires after lockout period
      await this.redis.set(lockKey(email), String(Date.now()), LOCKOUT_SECONDS);
      await this.redis.del(key);
    } else {
      // Keep count alive for 30 minutes (resets if never triggered)
      await this.redis.set(key, String(count), 30 * 60);
    }
  }

  private async clearAttempts(email: string): Promise<void> {
    await this.redis.del(attemptKey(email), lockKey(email));
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
    await this.checkLockout(dto.email);

    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) {
      // Record attempt even for unknown emails (prevents timing-based enumeration)
      await this.recordFailedAttempt(dto.email);
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) {
      await this.recordFailedAttempt(dto.email);
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.clearAttempts(dto.email);
    return this.buildTokenResponse(user.id, user.email, user.role);
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Always return the same message — prevents email enumeration
    const SUCCESS_MESSAGE = 'If this email is registered, a reset link has been sent.';

    if (!user) return { message: SUCCESS_MESSAGE };

    // Invalidate any existing token for this user (reverse-index lookup)
    const oldToken = await this.redis.get(resetUserKey(user.id));
    if (oldToken) await this.redis.del(resetKey(oldToken), resetUserKey(user.id));

    const token = randomUUID();
    // Store token → userId and userId → token (both expire in 1 hour)
    await this.redis.set(resetKey(token), user.id, RESET_TOKEN_TTL_SECONDS);
    await this.redis.set(resetUserKey(user.id), token, RESET_TOKEN_TTL_SECONDS);

    await this.mail.sendPasswordReset(email, token);

    return { message: SUCCESS_MESSAGE };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const userId = await this.redis.get(resetKey(token));
    if (!userId) throw new BadRequestException('Invalid or expired reset token.');

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } });

    // Invalidate both keys
    await this.redis.del(resetKey(token), resetUserKey(userId));
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

import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { RedisService } from '../redis/redis.service';

// ── Mock helpers ────────────────────────────────────────────────────────────

const mockUser = {
  id: 'user-1',
  email: 'test@bellat.net',
  fullName: 'Test User',
  phoneNumber: '+213600000001',
  passwordHash: '$2b$12$hashedpassword',
  role: 'customer',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const prismaMock = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

const jwtMock = {
  sign: jest.fn().mockReturnValue('mock-token'),
  verify: jest.fn(),
};

const configMock = {
  get: jest.fn((key: string) => {
    const map: Record<string, string> = {
      JWT_SECRET: 'test-secret',
      JWT_REFRESH_SECRET: 'test-refresh-secret',
      JWT_EXPIRES_IN: '15m',
      JWT_REFRESH_EXPIRES_IN: '7d',
    };
    return map[key] ?? '';
  }),
};

const mailMock = {
  sendWelcome: jest.fn().mockResolvedValue(undefined),
  sendPasswordReset: jest.fn().mockResolvedValue(undefined),
};

// Stateful in-memory store so lockout and reset-token tests work without a real Redis
const redisStore = new Map<string, string>();
const redisMock: Partial<RedisService> = {
  get: jest.fn(async (key: string) => redisStore.get(key) ?? null),
  set: jest.fn(async (key: string, value: string) => { redisStore.set(key, value); }),
  del: jest.fn(async (...keys: string[]) => { keys.forEach((k) => redisStore.delete(k)); }),
  getJson: jest.fn(async () => null),
  setJson: jest.fn(async () => undefined),
};

// ── Tests ──────────────────────────────────────────────────────────────────

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    redisStore.clear();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService,  useValue: prismaMock },
        { provide: JwtService,     useValue: jwtMock },
        { provide: ConfigService,  useValue: configMock },
        { provide: MailService,    useValue: mailMock },
        { provide: RedisService,   useValue: redisMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
    // Re-bind mocks after clearAllMocks (implementations are preserved on the object)
    (redisMock.get as jest.Mock).mockImplementation(async (key: string) => redisStore.get(key) ?? null);
    (redisMock.set as jest.Mock).mockImplementation(async (key: string, value: string) => { redisStore.set(key, value); });
    (redisMock.del as jest.Mock).mockImplementation(async (...keys: string[]) => { keys.forEach((k) => redisStore.delete(k)); });
  });

  // ── register ──────────────────────────────────────────────────────────────

  describe('register', () => {
    it('creates a new user and returns tokens', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(mockUser);

      const result = await service.register({
        fullName: 'Test User',
        email: 'test@bellat.net',
        phoneNumber: '+213600000001',
        password: 'password123',
      });

      expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('throws ConflictException if email already registered', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.register({
          fullName: 'Test User',
          email: 'test@bellat.net',
          phoneNumber: '+213600000002',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('fires welcome email without blocking', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(mockUser);

      await service.register({
        fullName: 'Test User',
        email: 'test@bellat.net',
        phoneNumber: '+213600000001',
        password: 'password123',
      });

      // Email is fire-and-forget so we just verify it was called
      expect(mailMock.sendWelcome).toHaveBeenCalledWith(mockUser.email, mockUser.fullName);
    });
  });

  // ── login ─────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('returns tokens for valid credentials', async () => {
      const hash = await bcrypt.hash('password123', 12);
      prismaMock.user.findUnique.mockResolvedValue({ ...mockUser, passwordHash: hash });

      const result = await service.login({ email: 'test@bellat.net', password: 'password123' });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('throws UnauthorizedException for unknown email', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nobody@bellat.net', password: 'any' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for wrong password', async () => {
      const hash = await bcrypt.hash('correct-password', 12);
      prismaMock.user.findUnique.mockResolvedValue({ ...mockUser, passwordHash: hash });

      await expect(
        service.login({ email: 'test@bellat.net', password: 'wrong-password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('locks account after 5 failed attempts', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null); // always fails

      for (let i = 0; i < 5; i++) {
        await expect(
          service.login({ email: 'locked@bellat.net', password: 'x' }),
        ).rejects.toThrow(UnauthorizedException);
      }

      // 6th attempt should be locked
      await expect(
        service.login({ email: 'locked@bellat.net', password: 'x' }),
      ).rejects.toThrow(/temporarily locked/i);
    });
  });

  // ── forgotPassword ────────────────────────────────────────────────────────

  describe('forgotPassword', () => {
    it('returns the same message regardless of email existence (prevents enumeration)', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      const result = await service.forgotPassword('nobody@example.com');
      expect(result.message).toMatch(/If this email is registered/);
    });

    it('sends reset email when user exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      await service.forgotPassword(mockUser.email);
      expect(mailMock.sendPasswordReset).toHaveBeenCalledWith(mockUser.email, expect.any(String));
    });
  });
});

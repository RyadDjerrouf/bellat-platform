import { PrismaClient } from '@prisma/client';

// Singleton pattern: reuse one PrismaClient across the app.
// In development, hot-reloads would create new instances each time without this guard,
// quickly exhausting the database connection pool.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ['error', 'warn'] });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export * from '@prisma/client';

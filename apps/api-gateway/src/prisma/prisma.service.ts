import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Extends PrismaClient so every NestJS service can inject this and get full type safety.
// OnModuleInit / OnModuleDestroy ensure the DB connection is opened and closed
// alongside the NestJS application lifecycle.
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

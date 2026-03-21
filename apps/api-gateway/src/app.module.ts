import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { InventoryModule } from './inventory/inventory.module';
import { UsersModule } from './users/users.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { FavoritesModule } from './favorites/favorites.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    // Makes process.env variables available across all modules
    ConfigModule.forRoot({ isGlobal: true }),

    // Rate limiting: 100 requests per 60 seconds per IP (public routes)
    // Individual routes can override this with @Throttle() or @SkipThrottle()
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),

    // Task scheduling — used by InventoryScheduler for hourly stock checks
    ScheduleModule.forRoot(),

    // Global DB access — PrismaService injectable in any module
    PrismaModule,

    AuthModule,
    ProductsModule,
    OrdersModule,
    InventoryModule,
    UsersModule,
    AnalyticsModule,
    FavoritesModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [
    // Apply rate limiting globally to all routes
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Log every incoming request
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

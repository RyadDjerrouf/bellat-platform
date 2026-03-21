import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { OrdersController, AdminOrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersGateway } from './orders.gateway';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MailModule,
    // JwtModule with no default secret — gateway verifies with explicit secret from ConfigService
    JwtModule.register({}),
  ],
  controllers: [OrdersController, AdminOrdersController],
  providers: [OrdersService, OrdersGateway],
})
export class OrdersModule {}

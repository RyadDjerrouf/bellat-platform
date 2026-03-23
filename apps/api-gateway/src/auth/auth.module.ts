import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailModule } from '../mail/mail.module';
// RedisModule is @Global — RedisService is available without importing RedisModule here

@Module({
  imports: [
    PassportModule,
    // JwtModule is registered without a default secret here — each sign() call
    // passes its own secret from ConfigService (supports access + refresh secrets)
    JwtModule.register({}),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

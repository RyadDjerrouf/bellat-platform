import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

// @Global makes RedisService injectable in any module without re-importing
@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}

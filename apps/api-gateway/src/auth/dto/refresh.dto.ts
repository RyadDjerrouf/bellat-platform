import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshDto {
  @ApiProperty({ description: '7-day refresh token returned at login/register' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateSettingDto {
  @ApiProperty({ example: 'contact@bellat.dz' })
  @IsString()
  value!: string;
}

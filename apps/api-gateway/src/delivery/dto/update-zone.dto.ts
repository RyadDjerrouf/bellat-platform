import { IsNumber, IsBoolean, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateZoneDto {
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  deliveryFee: number;

  @IsBoolean()
  isActive: boolean;
}

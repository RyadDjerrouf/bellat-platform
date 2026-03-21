import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsNumber, Min } from 'class-validator';
import { StockStatus } from '@prisma/client';

export class UpdateStockDto {
  @ApiProperty({ enum: StockStatus, example: 'low_stock', required: false })
  @IsOptional()
  @IsEnum(StockStatus)
  stockStatus?: StockStatus;

  @ApiProperty({ example: 1500, required: false, description: 'New price in DZD' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}

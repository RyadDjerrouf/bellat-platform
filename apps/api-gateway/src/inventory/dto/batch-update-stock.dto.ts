import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsString, ValidateNested } from 'class-validator';
import { StockStatus } from '@prisma/client';

class StockEntry {
  @ApiProperty({ example: 'prod_001' })
  @IsString()
  productId: string;

  @ApiProperty({ enum: StockStatus, example: 'in_stock' })
  @IsEnum(StockStatus)
  stockStatus: StockStatus;
}

export class BatchUpdateStockDto {
  @ApiProperty({ type: [StockEntry] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockEntry)
  items: StockEntry[];
}

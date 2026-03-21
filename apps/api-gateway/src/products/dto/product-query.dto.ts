import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { StockStatus } from '@prisma/client';

export class ProductQueryDto {
  @ApiPropertyOptional({ description: 'Filter by category slug', example: 'kachir' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ enum: StockStatus, description: 'Filter by stock status' })
  @IsOptional()
  @IsEnum(StockStatus)
  stockStatus?: StockStatus;

  @ApiPropertyOptional({ description: 'Full-text search query', example: 'kachir boeuf' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

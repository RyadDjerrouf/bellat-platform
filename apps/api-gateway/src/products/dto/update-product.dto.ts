import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { StockStatus } from '@prisma/client';

export class UpdateProductDto {
  @ApiPropertyOptional() @IsOptional() @IsString() nameFr?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nameAr?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() descriptionFr?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() descriptionAr?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() categoryId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() imageUrl?: string;
  @ApiPropertyOptional() @IsOptional() price?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() unit?: string;
  @ApiPropertyOptional({ enum: StockStatus }) @IsOptional() @IsEnum(StockStatus) stockStatus?: StockStatus;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}

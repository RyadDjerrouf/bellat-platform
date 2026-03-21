import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StockStatus } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({ example: 'prod_010' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'Kachir Bœuf Premium' })
  @IsString()
  @IsNotEmpty()
  nameFr: string;

  @ApiProperty({ example: 'كشير بقري فاخر' })
  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @ApiPropertyOptional({ example: 'Description en français' })
  @IsOptional()
  @IsString()
  descriptionFr?: string;

  @ApiPropertyOptional({ example: 'وصف بالعربية' })
  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @ApiPropertyOptional({ example: 'kachir' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ example: '/images/products/kachir.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: 450, description: 'Price in DZD' })
  @IsNotEmpty()
  price: number;

  @ApiPropertyOptional({ example: '500g' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ enum: StockStatus, default: StockStatus.in_stock })
  @IsOptional()
  @IsEnum(StockStatus)
  stockStatus?: StockStatus;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

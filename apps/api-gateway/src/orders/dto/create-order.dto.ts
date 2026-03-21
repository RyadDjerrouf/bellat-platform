import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({ example: 'prod_001' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class DeliveryAddressDto {
  @ApiProperty({ example: 'Amine Benali' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '+213555123456' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: '12 Rue des Frères Bouadem' })
  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @ApiPropertyOptional({ example: 'Appt 3, Bât B' })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  /** One of 48 Algerian administrative divisions */
  @ApiProperty({ example: 'Alger' })
  @IsString()
  @IsNotEmpty()
  wilaya: string;

  @ApiProperty({ example: 'Bab El Oued' })
  @IsString()
  @IsNotEmpty()
  commune: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ type: DeliveryAddressDto })
  @ValidateNested()
  @Type(() => DeliveryAddressDto)
  deliveryAddress: DeliveryAddressDto;

  @ApiProperty({ example: '2026-04-01', description: 'ISO date string (YYYY-MM-DD)' })
  @IsDateString()
  deliverySlotDate: string;

  @ApiProperty({ example: 'Matin (8h - 12h)' })
  @IsString()
  @IsNotEmpty()
  deliverySlotTime: string;

  /** Primary payment method in Algeria is cash on delivery */
  @ApiPropertyOptional({ example: 'cash_on_delivery', default: 'cash_on_delivery' })
  @IsOptional()
  @IsString()
  paymentMethod?: string;
}

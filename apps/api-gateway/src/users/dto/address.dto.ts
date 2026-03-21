import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ example: 'Amine Benali' })
  @IsString()
  @MaxLength(100)
  fullName: string;

  @ApiProperty({ example: '+213555123456', description: 'Algerian phone: +213XXXXXXXXX' })
  @IsString()
  @Matches(/^\+213\d{9}$/, { message: 'Phone must be in +213XXXXXXXXX format' })
  phoneNumber: string;

  @ApiProperty({ example: '12 Rue Didouche Mourad' })
  @IsString()
  @MaxLength(255)
  addressLine1: string;

  @ApiProperty({ example: 'Sétif', description: 'One of 48 Algerian wilayas' })
  @IsString()
  @MaxLength(100)
  wilaya: string;

  @ApiProperty({ example: 'Sétif' })
  @IsString()
  @MaxLength(100)
  commune: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}

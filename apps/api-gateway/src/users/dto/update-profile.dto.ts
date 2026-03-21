import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Amine Benali', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;

  @ApiProperty({ example: '+213555123456', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\+213\d{9}$/, { message: 'Phone must be in +213XXXXXXXXX format' })
  phoneNumber?: string;

  @ApiProperty({ required: false, description: 'Current password — required when changing password' })
  @IsOptional()
  @IsString()
  currentPassword?: string;

  @ApiProperty({ required: false, minLength: 8 })
  @IsOptional()
  @IsString()
  @MinLength(8)
  newPassword?: string;
}

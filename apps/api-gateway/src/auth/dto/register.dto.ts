import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Amine Benali' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'amine@example.com' })
  @IsEmail()
  email: string;

  // Algerian phone format: +213 followed by 9 digits
  @ApiPropertyOptional({ example: '+213555123456' })
  @IsOptional()
  @Matches(/^\+213[0-9]{9}$/, { message: 'Phone must be in Algerian format: +213XXXXXXXXX' })
  phoneNumber?: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @MinLength(8)
  password: string;
}

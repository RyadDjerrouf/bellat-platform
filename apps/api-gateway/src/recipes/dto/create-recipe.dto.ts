import { IsString, IsOptional, IsInt, IsBoolean, IsArray, Min, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateIngredientDto {
  @ApiPropertyOptional() @IsOptional() @IsString() productId?: string;
  @ApiProperty() @IsString() @MaxLength(255) nameFr: string;
  @ApiProperty() @IsString() @MaxLength(255) nameAr: string;
  @ApiProperty() @IsString() @MaxLength(50) quantity: string;
  @ApiProperty() @IsString() @MaxLength(50) unit: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() sortOrder?: number;
}

export class CreateRecipeDto {
  @ApiProperty() @IsString() @MaxLength(100) id: string;
  @ApiProperty() @IsString() @MaxLength(255) nameFr: string;
  @ApiProperty() @IsString() @MaxLength(255) nameAr: string;
  @ApiPropertyOptional() @IsOptional() @IsString() descriptionFr?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() descriptionAr?: string;
  @ApiProperty() @IsString() @MaxLength(50) category: string;
  @ApiPropertyOptional() @IsOptional() @IsString() imageUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) prepTime?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) cookTime?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) servings?: number;
  @ApiProperty() @IsString() @MaxLength(20) difficulty: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() stepsFr?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() stepsAr?: string[];
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional({ type: [CreateIngredientDto] })
  @IsOptional() @IsArray() ingredients?: CreateIngredientDto[];
}

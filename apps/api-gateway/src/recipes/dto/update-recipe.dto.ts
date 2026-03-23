import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateRecipeDto } from './create-recipe.dto';

// id is not updatable after creation
export class UpdateRecipeDto extends PartialType(OmitType(CreateRecipeDto, ['id'] as const)) {}

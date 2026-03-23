import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

const WITH_INGREDIENTS = {
  ingredients: {
    orderBy: { sortOrder: 'asc' as const },
  },
};

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Public: active recipes, optionally filtered by category */
  findAll(category?: string) {
    return this.prisma.recipe.findMany({
      where: { isActive: true, ...(category ? { category } : {}) },
      include: WITH_INGREDIENTS,
      orderBy: { createdAt: 'asc' },
    });
  }

  /** Admin: all recipes regardless of isActive */
  findAllAdmin(category?: string) {
    return this.prisma.recipe.findMany({
      where: category ? { category } : {},
      include: WITH_INGREDIENTS,
      orderBy: { createdAt: 'asc' },
    });
  }

  /** Public: single active recipe by id */
  async findOne(id: string) {
    const recipe = await this.prisma.recipe.findFirst({
      where: { id, isActive: true },
      include: WITH_INGREDIENTS,
    });
    if (!recipe) throw new NotFoundException(`Recipe "${id}" not found`);
    return recipe;
  }

  /** Admin: single recipe by id regardless of isActive */
  async findOneAdmin(id: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: WITH_INGREDIENTS,
    });
    if (!recipe) throw new NotFoundException(`Recipe "${id}" not found`);
    return recipe;
  }

  async create(dto: CreateRecipeDto) {
    const existing = await this.prisma.recipe.findUnique({ where: { id: dto.id } });
    if (existing) throw new ConflictException(`Recipe id "${dto.id}" already exists`);

    const { ingredients, ...recipeData } = dto;

    return this.prisma.recipe.create({
      data: {
        ...recipeData,
        stepsFr: recipeData.stepsFr ?? [],
        stepsAr: recipeData.stepsAr ?? [],
        ingredients: ingredients?.length
          ? {
              create: ingredients.map((ing, i) => ({
                ...ing,
                sortOrder: ing.sortOrder ?? i,
              })),
            }
          : undefined,
      },
      include: WITH_INGREDIENTS,
    });
  }

  async update(id: string, dto: UpdateRecipeDto) {
    await this.findOneAdmin(id); // 404 if missing

    const { ingredients, ...recipeData } = dto;

    // If ingredients provided, replace them entirely
    if (ingredients !== undefined) {
      await this.prisma.recipeIngredient.deleteMany({ where: { recipeId: id } });
    }

    return this.prisma.recipe.update({
      where: { id },
      data: {
        ...recipeData,
        ...(ingredients !== undefined
          ? {
              ingredients: {
                create: ingredients.map((ing, i) => ({
                  ...ing,
                  sortOrder: ing.sortOrder ?? i,
                })),
              },
            }
          : {}),
      },
      include: WITH_INGREDIENTS,
    });
  }

  async remove(id: string) {
    await this.findOneAdmin(id); // 404 if missing
    // Soft-delete: set isActive = false
    return this.prisma.recipe.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { PrismaService } from '../prisma/prisma.service';

// ── Mock data ─────────────────────────────────────────────────────────────────

const mockIngredient = {
  id: 'ing-1',
  recipeId: 'chawarma-maison',
  productId: 'prod_009',
  nameFr: 'Chawarma Épicée Bellat',
  nameAr: 'شاورما حارة بيلات',
  quantity: '400',
  unit: 'g',
  sortOrder: 0,
};

const mockRecipe = {
  id: 'chawarma-maison',
  nameFr: 'Chawarma maison façon Bellat',
  nameAr: 'شاورما بيتية على طريقة بيلات',
  descriptionFr: 'Une recette rapide...',
  descriptionAr: 'وصفة سريعة...',
  category: 'quick',
  imageUrl: '/images/recipes/chawarma.jpg',
  prepTime: 10,
  cookTime: 15,
  servings: 4,
  difficulty: 'easy',
  stepsFr: ['Étape 1', 'Étape 2'],
  stepsAr: ['خطوة 1', 'خطوة 2'],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ingredients: [mockIngredient],
};

const prismaMock = {
  recipe: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  recipeIngredient: {
    deleteMany: jest.fn(),
  },
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('RecipesService', () => {
  let service: RecipesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
    jest.clearAllMocks();
  });

  // ── findAll ─────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('returns active recipes', async () => {
      prismaMock.recipe.findMany.mockResolvedValue([mockRecipe]);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(prismaMock.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ isActive: true }) }),
      );
    });

    it('filters by category when provided', async () => {
      prismaMock.recipe.findMany.mockResolvedValue([mockRecipe]);
      await service.findAll('quick');
      expect(prismaMock.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isActive: true, category: 'quick' } }),
      );
    });

    it('returns empty array when no recipes exist', async () => {
      prismaMock.recipe.findMany.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  // ── findOne ─────────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('returns recipe when found', async () => {
      prismaMock.recipe.findFirst.mockResolvedValue(mockRecipe);
      const result = await service.findOne('chawarma-maison');
      expect(result.id).toBe('chawarma-maison');
      expect(result.ingredients).toHaveLength(1);
    });

    it('throws NotFoundException when recipe not found', async () => {
      prismaMock.recipe.findFirst.mockResolvedValue(null);
      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  // ── findOneAdmin ─────────────────────────────────────────────────────────────

  describe('findOneAdmin', () => {
    it('returns inactive recipe for admin', async () => {
      const inactiveRecipe = { ...mockRecipe, isActive: false };
      prismaMock.recipe.findUnique.mockResolvedValue(inactiveRecipe);
      const result = await service.findOneAdmin('chawarma-maison');
      expect(result.isActive).toBe(false);
    });

    it('throws NotFoundException when recipe not found', async () => {
      prismaMock.recipe.findUnique.mockResolvedValue(null);
      await expect(service.findOneAdmin('ghost')).rejects.toThrow(NotFoundException);
    });
  });

  // ── create ──────────────────────────────────────────────────────────────────

  describe('create', () => {
    const createDto = {
      id: 'new-recipe',
      nameFr: 'Nouvelle recette',
      nameAr: 'وصفة جديدة',
      category: 'main',
      difficulty: 'medium',
      stepsFr: ['Étape 1'],
      stepsAr: ['خطوة 1'],
    };

    it('creates recipe when id is unique', async () => {
      prismaMock.recipe.findUnique.mockResolvedValue(null); // no conflict
      prismaMock.recipe.create.mockResolvedValue({ ...mockRecipe, id: 'new-recipe' });
      const result = await service.create(createDto);
      expect(prismaMock.recipe.create).toHaveBeenCalledTimes(1);
      expect(result.id).toBe('new-recipe');
    });

    it('throws ConflictException when id already exists', async () => {
      prismaMock.recipe.findUnique.mockResolvedValue(mockRecipe); // conflict
      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      expect(prismaMock.recipe.create).not.toHaveBeenCalled();
    });

    it('creates ingredients when provided', async () => {
      prismaMock.recipe.findUnique.mockResolvedValue(null);
      prismaMock.recipe.create.mockResolvedValue({ ...mockRecipe, id: 'new-recipe', ingredients: [mockIngredient] });
      const dtoWithIngredients = {
        ...createDto,
        ingredients: [{ nameFr: 'Tomate', nameAr: 'طماطم', quantity: '2', unit: 'pièces' }],
      };
      const result = await service.create(dtoWithIngredients);
      expect(prismaMock.recipe.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            ingredients: expect.objectContaining({ create: expect.any(Array) }),
          }),
        }),
      );
      expect(result.ingredients).toBeDefined();
    });
  });

  // ── update ──────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('updates recipe fields', async () => {
      prismaMock.recipe.findUnique.mockResolvedValue(mockRecipe);
      const updated = { ...mockRecipe, nameFr: 'Chawarma modifié' };
      prismaMock.recipe.update.mockResolvedValue(updated);

      const result = await service.update('chawarma-maison', { nameFr: 'Chawarma modifié' });
      expect(result.nameFr).toBe('Chawarma modifié');
      expect(prismaMock.recipe.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'chawarma-maison' } }),
      );
    });

    it('replaces ingredients when provided in update payload', async () => {
      prismaMock.recipe.findUnique.mockResolvedValue(mockRecipe);
      prismaMock.recipeIngredient.deleteMany.mockResolvedValue({ count: 1 });
      prismaMock.recipe.update.mockResolvedValue(mockRecipe);

      await service.update('chawarma-maison', {
        ingredients: [{ nameFr: 'Baguette', nameAr: 'باجيت', quantity: '1', unit: 'pièce' }],
      });

      expect(prismaMock.recipeIngredient.deleteMany).toHaveBeenCalledWith({ where: { recipeId: 'chawarma-maison' } });
    });

    it('does not delete ingredients when not provided in update payload', async () => {
      prismaMock.recipe.findUnique.mockResolvedValue(mockRecipe);
      prismaMock.recipe.update.mockResolvedValue(mockRecipe);

      await service.update('chawarma-maison', { nameFr: 'Nouveau titre' });
      expect(prismaMock.recipeIngredient.deleteMany).not.toHaveBeenCalled();
    });

    it('throws NotFoundException for unknown recipe', async () => {
      prismaMock.recipe.findUnique.mockResolvedValue(null);
      await expect(service.update('ghost', { nameFr: 'x' })).rejects.toThrow(NotFoundException);
    });
  });

  // ── remove ──────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('soft-deletes recipe by setting isActive=false', async () => {
      prismaMock.recipe.findUnique.mockResolvedValue(mockRecipe);
      prismaMock.recipe.update.mockResolvedValue({ ...mockRecipe, isActive: false });

      const result = await service.remove('chawarma-maison');
      expect(result.isActive).toBe(false);
      expect(prismaMock.recipe.update).toHaveBeenCalledWith({
        where: { id: 'chawarma-maison' },
        data: { isActive: false },
      });
    });

    it('throws NotFoundException for unknown recipe', async () => {
      prismaMock.recipe.findUnique.mockResolvedValue(null);
      await expect(service.remove('ghost')).rejects.toThrow(NotFoundException);
    });
  });

  // ── findAllAdmin ─────────────────────────────────────────────────────────────

  describe('findAllAdmin', () => {
    it('returns all recipes including inactive', async () => {
      const recipes = [mockRecipe, { ...mockRecipe, id: 'recipe-2', isActive: false }];
      prismaMock.recipe.findMany.mockResolvedValue(recipes);
      const result = await service.findAllAdmin();
      expect(result).toHaveLength(2);
      // Admin findAll does not filter by isActive
      expect(prismaMock.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
    });
  });
});

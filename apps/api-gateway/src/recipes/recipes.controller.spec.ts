import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

// ── Mock data ─────────────────────────────────────────────────────────────────

const mockRecipe = {
  id: 'chawarma-maison',
  nameFr: 'Chawarma maison façon Bellat',
  nameAr: 'شاورما بيتية على طريقة بيلات',
  category: 'quick',
  isActive: true,
  ingredients: [],
};

const mockRecipeInactive = { ...mockRecipe, id: 'tajine-old', isActive: false };

const serviceMock = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  findAllAdmin: jest.fn(),
  findOneAdmin: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('RecipesController', () => {
  let controller: RecipesController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [{ provide: RecipesService, useValue: serviceMock }],
    }).compile();
    controller = module.get<RecipesController>(RecipesController);
  });

  // ── findAll (public) ───────────────────────────────────────────────────────

  describe('findAll', () => {
    it('returns all active recipes when no category filter', async () => {
      serviceMock.findAll.mockResolvedValue([mockRecipe]);
      const result = await controller.findAll();
      expect(result).toEqual([mockRecipe]);
      expect(serviceMock.findAll).toHaveBeenCalledWith(undefined);
    });

    it('passes category filter to service', async () => {
      serviceMock.findAll.mockResolvedValue([mockRecipe]);
      await controller.findAll('quick');
      expect(serviceMock.findAll).toHaveBeenCalledWith('quick');
    });
  });

  // ── findOne (public) ───────────────────────────────────────────────────────

  describe('findOne', () => {
    it('returns the recipe by id', async () => {
      serviceMock.findOne.mockResolvedValue(mockRecipe);
      const result = await controller.findOne('chawarma-maison');
      expect(result).toEqual(mockRecipe);
      expect(serviceMock.findOne).toHaveBeenCalledWith('chawarma-maison');
    });

    it('propagates NotFoundException from service', async () => {
      serviceMock.findOne.mockRejectedValue(new NotFoundException());
      await expect(controller.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  // ── findAllAdmin ───────────────────────────────────────────────────────────

  describe('findAllAdmin', () => {
    it('returns all recipes including inactive', async () => {
      serviceMock.findAllAdmin.mockResolvedValue([mockRecipe, mockRecipeInactive]);
      const result = await controller.findAllAdmin();
      expect(result).toHaveLength(2);
      expect(serviceMock.findAllAdmin).toHaveBeenCalledWith(undefined);
    });

    it('passes category filter to service', async () => {
      serviceMock.findAllAdmin.mockResolvedValue([mockRecipe]);
      await controller.findAllAdmin('quick');
      expect(serviceMock.findAllAdmin).toHaveBeenCalledWith('quick');
    });
  });

  // ── findOneAdmin ───────────────────────────────────────────────────────────

  describe('findOneAdmin', () => {
    it('returns the recipe including inactive ones', async () => {
      serviceMock.findOneAdmin.mockResolvedValue(mockRecipeInactive);
      const result = await controller.findOneAdmin('tajine-old');
      expect(result).toEqual(mockRecipeInactive);
    });

    it('propagates NotFoundException from service', async () => {
      serviceMock.findOneAdmin.mockRejectedValue(new NotFoundException());
      await expect(controller.findOneAdmin('ghost')).rejects.toThrow(NotFoundException);
    });
  });

  // ── create ─────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('delegates to service and returns created recipe', async () => {
      const dto = { id: 'new-recipe', nameFr: 'Tajine', nameAr: 'طاجين', category: 'traditional', difficulty: 'medium', ingredients: [] };
      serviceMock.create.mockResolvedValue({ ...mockRecipe, ...dto });
      const result = await controller.create(dto as any);
      expect(serviceMock.create).toHaveBeenCalledWith(dto);
      expect(result).toMatchObject({ id: 'new-recipe' });
    });
  });

  // ── update ─────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('delegates to service with id and dto', async () => {
      const dto = { nameFr: 'Updated Name' };
      const updated = { ...mockRecipe, nameFr: 'Updated Name' };
      serviceMock.update.mockResolvedValue(updated);
      const result = await controller.update('chawarma-maison', dto as any);
      expect(serviceMock.update).toHaveBeenCalledWith('chawarma-maison', dto);
      expect(result.nameFr).toBe('Updated Name');
    });

    it('propagates NotFoundException when recipe not found', async () => {
      serviceMock.update.mockRejectedValue(new NotFoundException());
      await expect(controller.update('ghost', {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  // ── remove ─────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('delegates to service and returns result', async () => {
      const deactivated = { ...mockRecipe, isActive: false };
      serviceMock.remove.mockResolvedValue(deactivated);
      const result = await controller.remove('chawarma-maison');
      expect(serviceMock.remove).toHaveBeenCalledWith('chawarma-maison');
      expect(result.isActive).toBe(false);
    });

    it('propagates NotFoundException when recipe not found', async () => {
      serviceMock.remove.mockRejectedValue(new NotFoundException());
      await expect(controller.remove('ghost')).rejects.toThrow(NotFoundException);
    });
  });
});

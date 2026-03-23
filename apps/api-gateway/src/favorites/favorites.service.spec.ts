import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { PrismaService } from '../prisma/prisma.service';

// ── Mock data ─────────────────────────────────────────────────────────────────

const USER_ID = 'user-123';
const PRODUCT_ID = 'prod_001';

const mockProduct = {
  id: PRODUCT_ID,
  nameFr: 'Merguez Bellat',
  nameAr: 'مرقاز بيلات',
  price: 850,
  imageUrl: '/images/merguez.jpg',
  unit: 'kg',
  stockStatus: 'in_stock',
  isActive: true,
  category: { id: 'cat-1', nameFr: 'Charcuterie', nameAr: 'شاركوتيري' },
};

const mockFavorite = {
  id: 'fav-1',
  userId: USER_ID,
  productId: PRODUCT_ID,
  createdAt: new Date('2026-03-20'),
  product: mockProduct,
};

const prismaMock = {
  favorite: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  product: {
    findUnique: jest.fn(),
  },
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();
    service = module.get<FavoritesService>(FavoritesService);
  });

  // ── list ───────────────────────────────────────────────────────────────────

  describe('list', () => {
    it('returns products with favoritedAt merged in', async () => {
      prismaMock.favorite.findMany.mockResolvedValue([mockFavorite]);
      const result = await service.list(USER_ID);
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ id: PRODUCT_ID, nameFr: 'Merguez Bellat' });
      expect(result[0].favoritedAt).toEqual(mockFavorite.createdAt);
    });

    it('returns empty array when user has no favorites', async () => {
      prismaMock.favorite.findMany.mockResolvedValue([]);
      expect(await service.list(USER_ID)).toEqual([]);
    });

    it('queries with correct userId filter ordered by createdAt desc', async () => {
      prismaMock.favorite.findMany.mockResolvedValue([]);
      await service.list(USER_ID);
      expect(prismaMock.favorite.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: USER_ID },
          orderBy: { createdAt: 'desc' },
        }),
      );
    });
  });

  // ── add ────────────────────────────────────────────────────────────────────

  describe('add', () => {
    it('creates a favorite and returns success message', async () => {
      prismaMock.product.findUnique.mockResolvedValue(mockProduct);
      prismaMock.favorite.create.mockResolvedValue(mockFavorite);

      const result = await service.add(USER_ID, PRODUCT_ID);

      expect(result).toEqual({ message: 'Added to favorites' });
      expect(prismaMock.favorite.create).toHaveBeenCalledWith({
        data: { userId: USER_ID, productId: PRODUCT_ID },
      });
    });

    it('throws NotFoundException when product does not exist', async () => {
      prismaMock.product.findUnique.mockResolvedValue(null);
      await expect(service.add(USER_ID, 'nonexistent')).rejects.toThrow(NotFoundException);
      expect(prismaMock.favorite.create).not.toHaveBeenCalled();
    });

    it('throws ConflictException when product is already favorited', async () => {
      prismaMock.product.findUnique.mockResolvedValue(mockProduct);
      prismaMock.favorite.create.mockRejectedValue(new Error('Unique constraint'));

      await expect(service.add(USER_ID, PRODUCT_ID)).rejects.toThrow(ConflictException);
    });
  });

  // ── remove ─────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('deletes the favorite and returns success message', async () => {
      prismaMock.favorite.findUnique.mockResolvedValue(mockFavorite);
      prismaMock.favorite.delete.mockResolvedValue(mockFavorite);

      const result = await service.remove(USER_ID, PRODUCT_ID);

      expect(result).toEqual({ message: 'Removed from favorites' });
      expect(prismaMock.favorite.delete).toHaveBeenCalledWith({
        where: { userId_productId: { userId: USER_ID, productId: PRODUCT_ID } },
      });
    });

    it('throws NotFoundException when favorite does not exist', async () => {
      prismaMock.favorite.findUnique.mockResolvedValue(null);
      await expect(service.remove(USER_ID, PRODUCT_ID)).rejects.toThrow(NotFoundException);
      expect(prismaMock.favorite.delete).not.toHaveBeenCalled();
    });
  });

  // ── isFavorite ─────────────────────────────────────────────────────────────

  describe('isFavorite', () => {
    it('returns true when favorite exists', async () => {
      prismaMock.favorite.findUnique.mockResolvedValue(mockFavorite);
      expect(await service.isFavorite(USER_ID, PRODUCT_ID)).toBe(true);
    });

    it('returns false when favorite does not exist', async () => {
      prismaMock.favorite.findUnique.mockResolvedValue(null);
      expect(await service.isFavorite(USER_ID, PRODUCT_ID)).toBe(false);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { PrismaService } from '../prisma/prisma.service';

// ── Mock data ─────────────────────────────────────────────────────────────────

const mockZone = {
  id: 1,
  wilaya: 'Alger',
  deliveryFee: 300,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockZoneInactive = {
  id: 2,
  wilaya: 'Béjaïa',
  deliveryFee: 500,
  isActive: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const prismaMock = {
  deliveryZone: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('DeliveryService', () => {
  let service: DeliveryService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();
    service = module.get<DeliveryService>(DeliveryService);
  });

  // ── findAll ────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('returns only active zones ordered by wilaya', async () => {
      prismaMock.deliveryZone.findMany.mockResolvedValue([mockZone]);
      const result = await service.findAll();
      expect(result).toEqual([mockZone]);
      expect(prismaMock.deliveryZone.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { wilaya: 'asc' },
      });
    });

    it('returns empty array when no active zones exist', async () => {
      prismaMock.deliveryZone.findMany.mockResolvedValue([]);
      expect(await service.findAll()).toEqual([]);
    });
  });

  // ── findAllAdmin ───────────────────────────────────────────────────────────

  describe('findAllAdmin', () => {
    it('returns all zones including inactive', async () => {
      prismaMock.deliveryZone.findMany.mockResolvedValue([mockZone, mockZoneInactive]);
      const result = await service.findAllAdmin();
      expect(result).toHaveLength(2);
      expect(prismaMock.deliveryZone.findMany).toHaveBeenCalledWith({
        orderBy: { wilaya: 'asc' },
      });
    });
  });

  // ── update ─────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('updates delivery fee and active status', async () => {
      const updated = { ...mockZone, deliveryFee: 400, isActive: false };
      prismaMock.deliveryZone.findUnique.mockResolvedValue(mockZone);
      prismaMock.deliveryZone.update.mockResolvedValue(updated);

      const result = await service.update(1, 400, false);

      expect(result).toEqual(updated);
      expect(prismaMock.deliveryZone.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deliveryFee: 400, isActive: false },
      });
    });

    it('throws NotFoundException when zone does not exist', async () => {
      prismaMock.deliveryZone.findUnique.mockResolvedValue(null);
      await expect(service.update(99, 300, true)).rejects.toThrow(NotFoundException);
      expect(prismaMock.deliveryZone.update).not.toHaveBeenCalled();
    });
  });
});

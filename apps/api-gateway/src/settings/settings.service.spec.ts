import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { PrismaService } from '../prisma/prisma.service';

const mockSetting = {
  key: 'app.name',
  value: 'Bellat',
  label: 'App Name',
  description: null,
  updatedAt: new Date(),
};

const prismaMock = {
  setting: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('returns all settings ordered by key', async () => {
      prismaMock.setting.findMany.mockResolvedValue([mockSetting]);
      const result = await service.findAll();
      expect(result).toEqual([mockSetting]);
      expect(prismaMock.setting.findMany).toHaveBeenCalledWith({ orderBy: { key: 'asc' } });
    });
  });

  describe('findOne', () => {
    it('returns setting when key exists', async () => {
      prismaMock.setting.findUnique.mockResolvedValue(mockSetting);
      const result = await service.findOne('app.name');
      expect(result).toEqual(mockSetting);
    });

    it('throws NotFoundException when key does not exist', async () => {
      prismaMock.setting.findUnique.mockResolvedValue(null);
      await expect(service.findOne('unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates value when key exists', async () => {
      prismaMock.setting.findUnique.mockResolvedValue(mockSetting);
      prismaMock.setting.update.mockResolvedValue({ ...mockSetting, value: 'New Name' });

      const result = await service.update('app.name', 'New Name');
      expect(result.value).toBe('New Name');
      expect(prismaMock.setting.update).toHaveBeenCalledWith({
        where: { key: 'app.name' },
        data: { value: 'New Name' },
      });
    });

    it('throws NotFoundException when key does not exist', async () => {
      prismaMock.setting.findUnique.mockResolvedValue(null);
      await expect(service.update('unknown', 'x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getValue', () => {
    it('returns setting value', async () => {
      prismaMock.setting.findUnique.mockResolvedValue(mockSetting);
      const result = await service.getValue('app.name');
      expect(result).toBe('Bellat');
    });

    it('returns fallback when setting does not exist', async () => {
      prismaMock.setting.findUnique.mockResolvedValue(null);
      const result = await service.getValue('app.unknown', 'default');
      expect(result).toBe('default');
    });

    it('returns empty string as default fallback', async () => {
      prismaMock.setting.findUnique.mockResolvedValue(null);
      const result = await service.getValue('app.unknown');
      expect(result).toBe('');
    });
  });
});

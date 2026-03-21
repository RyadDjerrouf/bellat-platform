import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { OrdersGateway } from './orders.gateway';

// ── Mock data ────────────────────────────────────────────────────────────────

const mockProduct = {
  id: 'prod-1',
  nameFr: 'Merguez',
  nameAr: 'مرقاز',
  price: { toNumber: () => 500 } as any, // Prisma Decimal mock
  stockStatus: 'in_stock',
  isActive: true,
};

const mockOrder = {
  id: 'BLT-20260321-00001',
  customerId: 'user-1',
  status: 'pending',
  subtotal: 1000,
  deliveryFee: 0,
  total: 1000,
  deliveryAddress: { fullName: 'Test', phoneNumber: '+213600000001', addressLine1: '1 Rue A', wilaya: 'Alger', commune: 'Sidi M\'Hamed' },
  deliverySlotDate: new Date('2026-03-25'),
  deliverySlotTime: '09:00-12:00',
  paymentMethod: 'cash_on_delivery',
  items: [{ productId: 'prod-1', quantity: 2, priceAtPurchase: 500, product: { nameFr: 'Merguez', nameAr: 'مرقاز', imageUrl: null, unit: 'kg' } }],
  customer: { email: 'user@bellat.net', fullName: 'Test User' },
  createdAt: new Date(),
  updatedAt: new Date(),
};

const prismaMock = {
  product: {
    findMany: jest.fn(),
  },
  order: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
};

const mailMock = {
  sendOrderConfirmation: jest.fn().mockResolvedValue(undefined),
};

const gatewayMock = {
  emitStatusUpdate: jest.fn(),
};

// ── Tests ──────────────────────────────────────────────────────────────────

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService,  useValue: prismaMock },
        { provide: MailService,    useValue: mailMock },
        { provide: OrdersGateway,  useValue: gatewayMock },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks();
  });

  // ── create ────────────────────────────────────────────────────────────────

  describe('create', () => {
    const dto = {
      items: [{ productId: 'prod-1', quantity: 2 }],
      deliveryAddress: { fullName: 'Test', phoneNumber: '+213600000001', addressLine1: '1 Rue A', wilaya: 'Alger', commune: 'Sidi M\'Hamed' },
      deliverySlotDate: '2026-03-25',
      deliverySlotTime: '09:00-12:00',
      paymentMethod: 'cash_on_delivery' as const,
    };

    it('throws BadRequestException for empty items array', async () => {
      await expect(service.create('user-1', { ...dto, items: [] })).rejects.toThrow(BadRequestException);
    });

    it('throws UnprocessableEntityException for unknown product', async () => {
      prismaMock.product.findMany.mockResolvedValue([]);
      await expect(service.create('user-1', dto)).rejects.toThrow(UnprocessableEntityException);
    });

    it('throws UnprocessableEntityException for out-of-stock product', async () => {
      prismaMock.product.findMany.mockResolvedValue([{ ...mockProduct, stockStatus: 'out_of_stock' }]);
      await expect(service.create('user-1', dto)).rejects.toThrow(UnprocessableEntityException);
    });

    it('creates order and returns it', async () => {
      prismaMock.product.findMany.mockResolvedValue([mockProduct]);
      prismaMock.order.count.mockResolvedValue(0);
      prismaMock.order.create.mockResolvedValue(mockOrder);

      const result = await service.create('user-1', dto);
      expect(result.id).toMatch(/^BLT-/);
      expect(prismaMock.order.create).toHaveBeenCalledTimes(1);
    });

    it('sends confirmation email (fire-and-forget)', async () => {
      prismaMock.product.findMany.mockResolvedValue([mockProduct]);
      prismaMock.order.count.mockResolvedValue(0);
      prismaMock.order.create.mockResolvedValue(mockOrder);

      await service.create('user-1', dto);
      expect(mailMock.sendOrderConfirmation).toHaveBeenCalledTimes(1);
    });
  });

  // ── findOneForUser ────────────────────────────────────────────────────────

  describe('findOneForUser', () => {
    it('returns order when it belongs to the customer', async () => {
      prismaMock.order.findUnique.mockResolvedValue(mockOrder);
      const result = await service.findOneForUser('user-1', mockOrder.id);
      expect(result.id).toBe(mockOrder.id);
    });

    it('throws NotFoundException when order does not exist', async () => {
      prismaMock.order.findUnique.mockResolvedValue(null);
      await expect(service.findOneForUser('user-1', 'FAKE-ID')).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when order belongs to another customer', async () => {
      prismaMock.order.findUnique.mockResolvedValue({ ...mockOrder, customerId: 'other-user' });
      await expect(service.findOneForUser('user-1', mockOrder.id)).rejects.toThrow(ForbiddenException);
    });
  });

  // ── cancel ────────────────────────────────────────────────────────────────

  describe('cancel', () => {
    it('cancels a pending order', async () => {
      prismaMock.order.findUnique.mockResolvedValue(mockOrder);
      prismaMock.order.update.mockResolvedValue({ ...mockOrder, status: 'cancelled' });

      const result = await service.cancel('user-1', mockOrder.id);
      expect(result.status).toBe('cancelled');
    });

    it('throws BadRequestException when order is not pending', async () => {
      prismaMock.order.findUnique.mockResolvedValue({ ...mockOrder, status: 'confirmed' });

      await expect(service.cancel('user-1', mockOrder.id)).rejects.toThrow(BadRequestException);
    });
  });

  // ── updateStatus ──────────────────────────────────────────────────────────

  describe('updateStatus', () => {
    it('transitions pending → confirmed', async () => {
      prismaMock.order.findUnique.mockResolvedValue(mockOrder);
      prismaMock.order.update.mockResolvedValue({ ...mockOrder, status: 'confirmed' });

      const result = await service.updateStatus(mockOrder.id, 'confirmed');
      expect(result.status).toBe('confirmed');
      expect(gatewayMock.emitStatusUpdate).toHaveBeenCalledWith(mockOrder.id, 'confirmed');
    });

    it('throws BadRequestException for invalid transition (pending → delivered)', async () => {
      prismaMock.order.findUnique.mockResolvedValue(mockOrder);

      await expect(service.updateStatus(mockOrder.id, 'delivered')).rejects.toThrow(BadRequestException);
    });

    it('throws NotFoundException when order does not exist', async () => {
      prismaMock.order.findUnique.mockResolvedValue(null);
      await expect(service.updateStatus('FAKE-ID', 'confirmed')).rejects.toThrow(NotFoundException);
    });
  });
});

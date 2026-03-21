import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { OrdersGateway } from './orders.gateway';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';

// Bellat is primarily B2B — delivery is free for all zones.
const DELIVERY_FEE = 0;

// Valid order status transitions — prevents skipping states
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending:          ['confirmed', 'cancelled'],
  confirmed:        ['preparing', 'cancelled'],
  preparing:        ['out_for_delivery'],
  out_for_delivery: ['delivered'],
  delivered:        [],
  cancelled:        [],
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly gateway: OrdersGateway,
  ) {}

  // ── Checkout ───────────────────────────────────────────────────────────────

  async create(customerId: string, dto: CreateOrderDto) {
    if (!dto.items.length) {
      throw new BadRequestException('Order must contain at least one item');
    }

    // Fetch all products in one query
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    // Validate every item exists and is in stock
    for (const item of dto.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new UnprocessableEntityException(`Product '${item.productId}' not found or unavailable`);
      }
      if (product.stockStatus === 'out_of_stock') {
        throw new UnprocessableEntityException(`Product '${item.productId}' is out of stock`);
      }
    }

    // Build a map for price lookup
    const productMap = new Map(products.map((p) => [p.id, p]));

    const subtotal = dto.items.reduce((sum, item) => {
      const price = Number(productMap.get(item.productId)!.price);
      return sum + price * item.quantity;
    }, 0);

    const deliveryFee = DELIVERY_FEE;

    const total = subtotal + deliveryFee;

    const orderId = await this.generateOrderId();

    const order = await this.prisma.order.create({
      data: {
        id: orderId,
        customerId,
        subtotal,
        deliveryFee,
        total,
        deliveryAddress: dto.deliveryAddress as object,
        deliverySlotDate: new Date(dto.deliverySlotDate),
        deliverySlotTime: dto.deliverySlotTime,
        paymentMethod: dto.paymentMethod ?? 'cash_on_delivery',
        items: {
          create: dto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: productMap.get(item.productId)!.price,
          })),
        },
      },
      include: {
        items: true,
        customer: { select: { email: true, fullName: true } },
      },
    });

    // Fire-and-forget confirmation email — never block the checkout response
    this.mail
      .sendOrderConfirmation(order.customer.email, order.customer.fullName, {
        id: order.id,
        total: Number(order.total),
        deliverySlotDate: order.deliverySlotDate,
        deliverySlotTime: order.deliverySlotTime,
        deliveryAddress: order.deliveryAddress,
        items: dto.items.map((item) => ({
          nameFr: productMap.get(item.productId)!.nameFr,
          quantity: item.quantity,
          priceAtPurchase: Number(productMap.get(item.productId)!.price),
        })),
      })
      .catch(() => {});

    return order;
  }

  // ── Customer order history ─────────────────────────────────────────────────

  async findAllForUser(customerId: string, query: OrderQueryDto) {
    const { status, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where = { customerId, ...(status && { status }) };

    const [total, items] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        include: { items: { include: { product: { select: { nameFr: true, nameAr: true, imageUrl: true } } } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return { data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOneForUser(customerId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: { select: { nameFr: true, nameAr: true, imageUrl: true, unit: true } } } } },
    });
    if (!order) throw new NotFoundException(`Order '${orderId}' not found`);
    // Customers may only view their own orders
    if (order.customerId !== customerId) throw new ForbiddenException();
    return order;
  }

  /** Reorder — creates a fresh order with the same items (at current prices) */
  async reorder(customerId: string, orderId: string) {
    const original = await this.findOneForUser(customerId, orderId);

    // Build a CreateOrderDto-compatible payload from the original order
    const items = original.items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
    }));

    const address = original.deliveryAddress as {
      fullName: string;
      phoneNumber: string;
      addressLine1: string;
      wilaya: string;
      commune: string;
    };

    // Use today as the delivery slot date — customer can update in checkout
    const today = new Date().toISOString().slice(0, 10);

    const dto: CreateOrderDto = {
      items,
      deliveryAddress: address,
      deliverySlotDate: today,
      deliverySlotTime: original.deliverySlotTime,
      paymentMethod: original.paymentMethod,
    };

    return this.create(customerId, dto);
  }

  async cancel(customerId: string, orderId: string) {
    const order = await this.findOneForUser(customerId, orderId);
    if (order.status !== 'pending') {
      throw new BadRequestException(`Only pending orders can be cancelled (current status: ${order.status})`);
    }
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'cancelled' },
    });
  }

  // ── Admin ──────────────────────────────────────────────────────────────────

  async findOneForAdmin(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: { select: { nameFr: true, nameAr: true, imageUrl: true, unit: true } } } },
        customer: { select: { fullName: true, email: true, phoneNumber: true } },
      },
    });
    if (!order) throw new NotFoundException(`Order '${orderId}' not found`);
    return order;
  }

  async findAll(query: OrderQueryDto) {
    const { status, q, from, to, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const rangeFrom = from ? new Date(from) : undefined;
    const rangeTo = to ? (() => { const d = new Date(to); d.setHours(23, 59, 59, 999); return d; })() : undefined;

    const where: Prisma.OrderWhereInput = {
      ...(status && { status }),
      ...((rangeFrom || rangeTo) && {
        createdAt: {
          ...(rangeFrom && { gte: rangeFrom }),
          ...(rangeTo && { lte: rangeTo }),
        },
      }),
      ...(q && {
        OR: [
          { id: { contains: q, mode: 'insensitive' } },
          { customer: { fullName: { contains: q, mode: 'insensitive' } } },
        ],
      }),
    };

    const [total, items] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        include: {
          items: true,
          customer: { select: { fullName: true, email: true, phoneNumber: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return { data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async updateStatus(orderId: string, newStatus: OrderStatus) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException(`Order '${orderId}' not found`);

    const allowed = VALID_TRANSITIONS[order.status];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from '${order.status}' to '${newStatus}'. ` +
        `Allowed: [${allowed.join(', ')}]`,
      );
    }

    const updated = await this.prisma.order.update({ where: { id: orderId }, data: { status: newStatus } });

    // Notify any connected customers watching this order
    this.gateway.emitStatusUpdate(orderId, newStatus);

    return updated;
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  /** Generate BLT-YYYYMMDD-NNNNN — zero-padded daily sequence */
  private async generateOrderId(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

    // Count orders created today to derive the sequence number
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 86_400_000);

    const count = await this.prisma.order.count({
      where: { createdAt: { gte: startOfDay, lt: endOfDay } },
    });

    const seq = String(count + 1).padStart(5, '0');
    return `BLT-${dateStr}-${seq}`;
  }
}

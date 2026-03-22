import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeliveryService {
  constructor(private readonly prisma: PrismaService) {}

  /** All zones — public endpoint for checkout fee lookup */
  findAll() {
    return this.prisma.deliveryZone.findMany({
      where: { isActive: true },
      orderBy: { wilaya: 'asc' },
    });
  }

  /** All zones including inactive — admin only */
  findAllAdmin() {
    return this.prisma.deliveryZone.findMany({ orderBy: { wilaya: 'asc' } });
  }

  async update(id: number, deliveryFee: number, isActive: boolean) {
    const zone = await this.prisma.deliveryZone.findUnique({ where: { id } });
    if (!zone) throw new NotFoundException(`Delivery zone ${id} not found`);
    return this.prisma.deliveryZone.update({
      where: { id },
      data: { deliveryFee, isActive },
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { StockStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateStockDto } from './dto/update-stock.dto';
import { BatchUpdateStockDto } from './dto/batch-update-stock.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  // ── List ───────────────────────────────────────────────────────────────────

  async findAll(params: {
    stockStatus?: StockStatus;
    categoryId?: string;
    page?: number;
    limit?: number;
  }) {
    const { stockStatus, categoryId, page = 1, limit = 50 } = params;
    const skip = (page - 1) * limit;

    const where = {
      isActive: true,
      ...(stockStatus && { stockStatus }),
      ...(categoryId && { categoryId }),
    };

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        select: {
          id: true,
          nameFr: true,
          nameAr: true,
          categoryId: true,
          price: true,
          unit: true,
          stockStatus: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    // Summary counts — useful for the admin dashboard overview
    const [inStock, lowStock, outOfStock] = await Promise.all([
      this.prisma.product.count({ where: { isActive: true, stockStatus: 'in_stock' } }),
      this.prisma.product.count({ where: { isActive: true, stockStatus: 'low_stock' } }),
      this.prisma.product.count({ where: { isActive: true, stockStatus: 'out_of_stock' } }),
    ]);

    return {
      data: products,
      meta: { total, page, totalPages: Math.ceil(total / limit) },
      summary: { inStock, lowStock, outOfStock },
    };
  }

  // ── Single product stock update ────────────────────────────────────────────

  async update(productId: string, dto: UpdateStockDto) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException(`Product '${productId}' not found`);

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        ...(dto.stockStatus !== undefined && { stockStatus: dto.stockStatus }),
        ...(dto.price !== undefined && { price: dto.price }),
      },
      select: {
        id: true,
        nameFr: true,
        nameAr: true,
        stockStatus: true,
        price: true,
        updatedAt: true,
      },
    });
  }

  // ── Batch update ───────────────────────────────────────────────────────────

  async batchUpdate(dto: BatchUpdateStockDto) {
    // Run all updates in a single transaction
    const results = await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.product.update({
          where: { id: item.productId },
          data: { stockStatus: item.stockStatus },
          select: { id: true, nameFr: true, stockStatus: true },
        }),
      ),
    );

    return { updated: results.length, products: results };
  }

  // ── Low-stock report ───────────────────────────────────────────────────────

  /** Returns all active products with low_stock or out_of_stock status. */
  async getLowStockReport() {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        stockStatus: { in: ['low_stock', 'out_of_stock'] },
      },
      select: {
        id: true,
        nameFr: true,
        nameAr: true,
        categoryId: true,
        stockStatus: true,
        updatedAt: true,
      },
      orderBy: [{ stockStatus: 'asc' }, { updatedAt: 'asc' }],
    });

    return { total: products.length, products };
  }
}

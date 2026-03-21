import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    q?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(200, Math.max(1, Number(params.limit) || 50));
    const { stockStatus, categoryId, q } = params;
    const skip = Math.max(0, (page - 1) * limit);

    const where = {
      isActive: true,
      ...(stockStatus && { stockStatus }),
      ...(categoryId && { categoryId }),
      ...(q && {
        OR: [
          { nameFr: { contains: q, mode: 'insensitive' as const } },
          { nameAr: { contains: q, mode: 'insensitive' as const } },
        ],
      }),
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

  // ── CSV bulk import ────────────────────────────────────────────────────────

  /** Parse a CSV file and batch-update stock statuses.
   *  Expected CSV format (with header row):
   *    productId,stockStatus
   *    prod_001,in_stock
   *    prod_002,out_of_stock
   */
  async importFromCsv(fileBuffer: Buffer): Promise<{ updated: number; skipped: number; errors: string[] }> {
    const text = fileBuffer.toString('utf-8');
    const lines = text.split(/\r?\n/).filter((l) => l.trim());

    if (lines.length < 2) {
      throw new BadRequestException('CSV must contain a header row and at least one data row');
    }

    const header = lines[0].toLowerCase().split(',').map((h) => h.trim());
    const idIdx  = header.indexOf('productid');
    const stIdx  = header.indexOf('stockstatus');

    if (idIdx === -1 || stIdx === -1) {
      throw new BadRequestException('CSV must have columns: productId, stockStatus');
    }

    const validStatuses = new Set<string>(['in_stock', 'low_stock', 'out_of_stock']);
    const updates: { productId: string; stockStatus: StockStatus }[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim());
      const productId   = cols[idIdx];
      const stockStatus = cols[stIdx];

      if (!productId) { errors.push(`Row ${i + 1}: missing productId`); continue; }
      if (!validStatuses.has(stockStatus)) {
        errors.push(`Row ${i + 1}: invalid stockStatus '${stockStatus}'`);
        continue;
      }
      updates.push({ productId, stockStatus: stockStatus as StockStatus });
    }

    if (updates.length === 0) {
      throw new BadRequestException('No valid rows found in CSV');
    }

    // Verify all product IDs exist before updating
    const ids = updates.map((u) => u.productId);
    const existing = await this.prisma.product.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
    const existingIds = new Set(existing.map((p) => p.id));

    const validUpdates = updates.filter((u) => {
      if (!existingIds.has(u.productId)) {
        errors.push(`Product '${u.productId}' not found — skipped`);
        return false;
      }
      return true;
    });

    await this.prisma.$transaction(
      validUpdates.map((u) =>
        this.prisma.product.update({
          where: { id: u.productId },
          data: { stockStatus: u.stockStatus },
        }),
      ),
    );

    return { updated: validUpdates.length, skipped: updates.length - validUpdates.length, errors };
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

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ProductQueryDto, ProductSortBy } from './dto/product-query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Public ─────────────────────────────────────────────────────────────────

  async findAll(query: ProductQueryDto) {
    const { category, stockStatus, q, sortBy, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(category && { categoryId: category }),
      ...(stockStatus && { stockStatus }),
      // Trigram similarity search via pg_trgm (falls back to ILIKE if extension not available)
      ...(q && {
        OR: [
          { nameFr: { contains: q, mode: 'insensitive' } },
          { nameAr: { contains: q, mode: 'insensitive' } },
        ],
      }),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sortBy === ProductSortBy.PRICE_ASC  ? { price: 'asc' } :
      sortBy === ProductSortBy.PRICE_DESC ? { price: 'desc' } :
      { createdAt: 'desc' }; // default: newest first

    const [total, items] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        include: { category: { select: { id: true, nameFr: true, nameAr: true } } },
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, isActive: true },
      include: { category: { select: { id: true, nameFr: true, nameAr: true } } },
    });
    if (!product) throw new NotFoundException(`Product '${id}' not found`);
    return product;
  }

  async findAllCategories() {
    return this.prisma.category.findMany({ orderBy: { nameFr: 'asc' } });
  }

  /** Autocomplete — top 5 active products matching the query via trigram similarity.
   *  Uses raw SQL so we can leverage the pg_trgm similarity() function directly. */
  async autocomplete(q: string) {
    if (!q || q.trim().length < 2) return [];

    // similarity() returns 0–1; 0.1 is a loose threshold that catches typos
    const results: { id: string; nameFr: string; nameAr: string; imageUrl: string | null }[] =
      await this.prisma.$queryRaw`
        SELECT id, name_fr AS "nameFr", name_ar AS "nameAr", image_url AS "imageUrl"
        FROM products
        WHERE is_active = true
          AND (
            similarity(name_fr, ${q}) > 0.1
            OR similarity(name_ar, ${q}) > 0.1
            OR name_fr ILIKE ${'%' + q + '%'}
            OR name_ar ILIKE ${'%' + q + '%'}
          )
        ORDER BY GREATEST(similarity(name_fr, ${q}), similarity(name_ar, ${q})) DESC
        LIMIT 5
      `;

    return results;
  }

  async findByCategory(categoryId: string, query: ProductQueryDto) {
    // Verify category exists
    const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw new NotFoundException(`Category '${categoryId}' not found`);
    return this.findAll({ ...query, category: categoryId });
  }

  // ── Admin ──────────────────────────────────────────────────────────────────

  async create(dto: CreateProductDto) {
    try {
      return await this.prisma.product.create({ data: dto });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException(`Product with id '${dto.id}' already exists`);
      }
      throw err;
    }
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.ensureExists(id);
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  /** Soft delete — sets isActive = false, product stays in DB for order history */
  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.product.update({ where: { id }, data: { isActive: false } });
    return { message: `Product '${id}' deactivated` };
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.product.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException(`Product '${id}' not found`);
  }
}

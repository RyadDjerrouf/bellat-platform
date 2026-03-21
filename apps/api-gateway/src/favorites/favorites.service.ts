import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true, nameFr: true, nameAr: true, price: true,
            imageUrl: true, unit: true, stockStatus: true, isActive: true,
            category: { select: { id: true, nameFr: true, nameAr: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return favorites.map((f) => ({ ...f.product, favoritedAt: f.createdAt }));
  }

  async add(userId: string, productId: string) {
    // Verify product exists
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException(`Product '${productId}' not found`);

    try {
      await this.prisma.favorite.create({ data: { userId, productId } });
    } catch {
      // P2002 = unique constraint — already favorited
      throw new ConflictException('Product is already in favorites');
    }
    return { message: 'Added to favorites' };
  }

  async remove(userId: string, productId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (!existing) throw new NotFoundException('Favorite not found');
    await this.prisma.favorite.delete({ where: { userId_productId: { userId, productId } } });
    return { message: 'Removed from favorites' };
  }

  async isFavorite(userId: string, productId: string): Promise<boolean> {
    const f = await this.prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    return f !== null;
  }
}

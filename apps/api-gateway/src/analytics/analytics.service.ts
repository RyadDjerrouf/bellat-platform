import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalOrders,
      revenueAgg,
      ordersByStatus,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      // Total all-time orders
      this.prisma.order.count(),

      // Total revenue from non-cancelled orders
      this.prisma.order.aggregate({
        where: { status: { not: 'cancelled' } },
        _sum: { total: true },
      }),

      // Order count grouped by status
      this.prisma.order.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),

      // Raw orders for last 30 days to compute daily revenue in JS
      this.prisma.order.findMany({
        where: {
          createdAt: { gte: thirtyDaysAgo },
          status: { not: 'cancelled' },
        },
        select: { createdAt: true, total: true },
        orderBy: { createdAt: 'asc' },
      }),

      // Top 5 products by revenue (sum of priceAtPurchase × quantity)
      this.prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { priceAtPurchase: true },
        _count: { _all: true },
        orderBy: { _sum: { priceAtPurchase: 'desc' } },
        take: 5,
      }),
    ]);

    // Aggregate daily revenue from raw rows
    const dailyMap: Record<string, number> = {};
    for (const order of recentOrders) {
      const day = order.createdAt.toISOString().slice(0, 10);
      dailyMap[day] = (dailyMap[day] ?? 0) + Number(order.total);
    }
    const dailyRevenue = Object.entries(dailyMap)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Resolve product names for top products
    const productIds = topProducts.map((t) => t.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, nameFr: true },
    });
    const productMap = Object.fromEntries(products.map((p) => [p.id, p.nameFr]));

    const topProductsWithNames = topProducts.map((t) => ({
      productId: t.productId,
      nameFr: productMap[t.productId] ?? t.productId,
      revenue: Number(t._sum.priceAtPurchase ?? 0),
      orderCount: t._count._all,
    }));

    return {
      totalOrders,
      totalRevenue: Number(revenueAgg._sum.total ?? 0),
      ordersByStatus: Object.fromEntries(
        ordersByStatus.map((g) => [g.status, g._count._all]),
      ),
      dailyRevenue,
      topProducts: topProductsWithNames,
    };
  }
}

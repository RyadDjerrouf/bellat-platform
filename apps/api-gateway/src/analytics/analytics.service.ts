import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(params?: { from?: string; to?: string }) {
    const defaultFrom = new Date();
    defaultFrom.setDate(defaultFrom.getDate() - 30);

    const rangeFrom = params?.from ? new Date(params.from) : defaultFrom;
    // `to` is end-of-day inclusive
    const rangeTo = params?.to ? (() => { const d = new Date(params.to!); d.setHours(23, 59, 59, 999); return d; })() : new Date();

    // Keep as alias for backward-compat inside method
    const thirtyDaysAgo = rangeFrom;

    const [
      totalOrders,
      revenueAgg,
      ordersByStatus,
      recentOrders,
      topProducts,
      orderItemsForCategories,
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

      // Raw orders in the selected date range to compute daily revenue in JS
      this.prisma.order.findMany({
        where: {
          createdAt: { gte: thirtyDaysAgo, lte: rangeTo },
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

      // Order items in range for category revenue breakdown
      this.prisma.orderItem.findMany({
        where: {
          order: {
            createdAt: { gte: rangeFrom, lte: rangeTo },
            status: { not: 'cancelled' },
          },
        },
        select: {
          priceAtPurchase: true,
          quantity: true,
          product: {
            select: {
              categoryId: true,
              category: { select: { nameFr: true } },
            },
          },
        },
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

    // Aggregate revenue by category from order items in range
    const catMap: Record<string, { nameFr: string; revenue: number }> = {};
    for (const item of orderItemsForCategories) {
      const catId = item.product.categoryId ?? 'uncategorized';
      const nameFr = item.product.category?.nameFr ?? 'Sans catégorie';
      if (!catMap[catId]) catMap[catId] = { nameFr, revenue: 0 };
      catMap[catId].revenue += Number(item.priceAtPurchase) * item.quantity;
    }
    const categoryRevenue = Object.entries(catMap)
      .map(([categoryId, { nameFr, revenue }]) => ({ categoryId, nameFr, revenue }))
      .sort((a, b) => b.revenue - a.revenue);

    return {
      totalOrders,
      totalRevenue: Number(revenueAgg._sum.total ?? 0),
      ordersByStatus: Object.fromEntries(
        ordersByStatus.map((g) => [g.status, g._count._all]),
      ),
      dailyRevenue,
      topProducts: topProductsWithNames,
      categoryRevenue,
    };
  }

  async getCustomerStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalCustomers, activeCustomers, newThisMonth, recentRegistrations] =
      await Promise.all([
        this.prisma.user.count({ where: { role: 'customer' } }),
        this.prisma.user.count({
          where: { role: 'customer', orders: { some: {} } },
        }),
        this.prisma.user.count({
          where: { role: 'customer', createdAt: { gte: startOfMonth } },
        }),
        this.prisma.user.findMany({
          where: { role: 'customer', createdAt: { gte: thirtyDaysAgo } },
          select: { createdAt: true },
          orderBy: { createdAt: 'asc' },
        }),
      ]);

    // Build daily registration counts
    const regMap: Record<string, number> = {};
    for (const u of recentRegistrations) {
      const day = u.createdAt.toISOString().slice(0, 10);
      regMap[day] = (regMap[day] ?? 0) + 1;
    }
    const dailyRegistrations = Object.entries(regMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return { totalCustomers, activeCustomers, newThisMonth, dailyRegistrations };
  }
}

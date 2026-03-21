import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class InventoryScheduler {
  private readonly logger = new Logger(InventoryScheduler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  /** Runs every hour — marks products with stock=0 as out_of_stock,
   *  then emails admin a summary if any alerts exist. */
  @Cron(CronExpression.EVERY_HOUR)
  async checkStockLevels() {
    this.logger.log('Running stock level check...');

    // Fetch all active products that are either low or out of stock
    const alerts = await this.prisma.product.findMany({
      where: {
        isActive: true,
        stockStatus: { in: ['low_stock', 'out_of_stock'] },
      },
      select: { id: true, nameFr: true, stockStatus: true },
      orderBy: [{ stockStatus: 'asc' }, { nameFr: 'asc' }],
    });

    if (alerts.length === 0) {
      this.logger.log('Stock check complete — no alerts');
      return;
    }

    const outOfStock = alerts.filter((p) => p.stockStatus === 'out_of_stock');
    const lowStock   = alerts.filter((p) => p.stockStatus === 'low_stock');

    this.logger.warn(
      `Stock alert: ${outOfStock.length} out-of-stock, ${lowStock.length} low-stock`,
    );

    // Get admin email(s)
    const admins = await this.prisma.user.findMany({
      where: { role: 'admin' },
      select: { email: true, fullName: true },
    });

    for (const admin of admins) {
      this.mail
        .sendStockAlert(admin.email, admin.fullName, { outOfStock, lowStock })
        .catch(() => {});
    }
  }
}

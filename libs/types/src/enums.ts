/** Mirrors Prisma OrderStatus enum */
export enum OrderStatus {
  Pending        = 'pending',
  Confirmed      = 'confirmed',
  Preparing      = 'preparing',
  OutForDelivery = 'out_for_delivery',
  Delivered      = 'delivered',
  Cancelled      = 'cancelled',
}

/** Mirrors Prisma StockStatus enum */
export enum StockStatus {
  InStock    = 'in_stock',
  LowStock   = 'low_stock',
  OutOfStock = 'out_of_stock',
}

/** Mirrors Prisma UserRole enum */
export enum UserRole {
  Customer = 'customer',
  Admin    = 'admin',
}

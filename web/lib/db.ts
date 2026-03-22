/**
 * Bellat offline database — powered by Dexie.js (IndexedDB wrapper).
 *
 * Stores:
 *  - products: cached product catalog for offline browsing
 *  - pendingOrders: orders queued while offline, to be submitted when back online
 */

import Dexie, { type EntityTable } from 'dexie';

// ── Schemas ───────────────────────────────────────────────────────────────────

export interface CachedProduct {
  id:          string;
  nameFr:      string;
  nameAr:      string;
  price:       number;
  unit:        string;
  stockStatus: string;
  imageUrl:    string | null;
  categoryId:  string;
  cachedAt:    number; // unix ms
}

export interface PendingOrder {
  localId:         string; // temporary local ID (uuid)
  items:           { productId: string; quantity: number }[];
  deliveryAddress: {
    fullName:     string;
    phoneNumber:  string;
    addressLine1: string;
    wilaya:       string;
    commune:      string;
  };
  deliverySlotDate: string;
  deliverySlotTime: string;
  paymentMethod:    string;
  createdAt:        number; // unix ms
  submittedAt:      number | null; // set once successfully synced
}

// ── Database class ─────────────────────────────────────────────────────────────

class BellatDatabase extends Dexie {
  products!: EntityTable<CachedProduct, 'id'>;
  pendingOrders!: EntityTable<PendingOrder, 'localId'>;

  constructor() {
    super('bellat-offline');
    this.version(1).stores({
      products:      'id, categoryId, stockStatus, cachedAt',
      pendingOrders: 'localId, createdAt, submittedAt',
    });
  }
}

export const db = new BellatDatabase();

// ── Product cache helpers ──────────────────────────────────────────────────────

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function cacheProducts(products: CachedProduct[]): Promise<void> {
  const now = Date.now();
  await db.products.bulkPut(products.map((p) => ({ ...p, cachedAt: now })));
}

export async function getCachedProducts(categoryId?: string): Promise<CachedProduct[]> {
  const cutoff = Date.now() - CACHE_TTL_MS;
  const query = db.products.where('cachedAt').above(cutoff);
  const results = await query.toArray();
  if (categoryId) return results.filter((p) => p.categoryId === categoryId);
  return results;
}

export async function getCachedProduct(id: string): Promise<CachedProduct | undefined> {
  return db.products.get(id);
}

export async function clearProductCache(): Promise<void> {
  await db.products.clear();
}

// ── Pending order queue ───────────────────────────────────────────────────────

export async function queueOrder(order: Omit<PendingOrder, 'localId' | 'createdAt' | 'submittedAt'>): Promise<string> {
  const localId = crypto.randomUUID();
  await db.pendingOrders.add({ ...order, localId, createdAt: Date.now(), submittedAt: null });
  return localId;
}

export async function getPendingOrders(): Promise<PendingOrder[]> {
  return db.pendingOrders.where('submittedAt').equals(0).toArray().catch(async () => {
    // submittedAt is null, not 0 — use filter instead
    const all = await db.pendingOrders.toArray();
    return all.filter((o) => o.submittedAt === null);
  });
}

export async function markOrderSubmitted(localId: string): Promise<void> {
  await db.pendingOrders.update(localId, { submittedAt: Date.now() });
}

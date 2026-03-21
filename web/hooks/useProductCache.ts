"use client";

import { useState, useEffect } from 'react';
import { getCachedProducts, cacheProducts, type CachedProduct } from '@/lib/db';
import { fetchProducts } from '@/lib/api';

/**
 * Returns the product catalog — from network when online, from IndexedDB when offline.
 * Also populates the cache whenever a fresh network response is received.
 */
export function useProductCache(categoryId?: string) {
  const [products, setProducts] = useState<CachedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState<'network' | 'cache' | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);

      if (navigator.onLine) {
        try {
          const params: Record<string, string> = { limit: '200' };
          if (categoryId) params.category = categoryId;
          const fresh = await fetchProducts(params);

          if (!cancelled) {
            const mapped: CachedProduct[] = fresh.map((p) => ({
              id:          p.id,
              nameFr:      p.name_fr,
              nameAr:      p.name_ar,
              price:       Number(p.price),
              unit:        p.unit ?? '',
              stockStatus: p.stock_status,
              imageUrl:    p.image ?? null,
              categoryId:  p.category ?? '',
              cachedAt:    Date.now(),
            }));
            await cacheProducts(mapped);
            setProducts(mapped);
            setSource('network');
            setIsLoading(false);
          }
          return;
        } catch {
          // Fall through to cache
        }
      }

      // Offline or network failed — serve from IndexedDB
      const cached = await getCachedProducts(categoryId);
      if (!cancelled) {
        setProducts(cached);
        setSource('cache');
        setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [categoryId]);

  return { products, isLoading, source };
}

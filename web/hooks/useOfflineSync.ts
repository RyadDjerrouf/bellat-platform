"use client";

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { getPendingOrders, markOrderSubmitted } from '@/lib/db';
import { placeOrder } from '@/lib/api';

/**
 * Listens for the browser coming back online and attempts to submit any
 * orders that were queued while offline.
 *
 * Must be used in a client component that has access to the auth token.
 */
export function useOfflineSync(token: string | null) {
  const syncingRef = useRef(false);

  const sync = async () => {
    if (!token || syncingRef.current || !navigator.onLine) return;
    syncingRef.current = true;

    try {
      const pending = await getPendingOrders();
      if (pending.length === 0) return;

      let synced = 0;
      for (const order of pending) {
        try {
          await placeOrder({
            items:            order.items,
            deliveryAddress:  order.deliveryAddress,
            deliverySlotDate: order.deliverySlotDate,
            deliverySlotTime: order.deliverySlotTime,
            paymentMethod:    order.paymentMethod,
          }, token);
          await markOrderSubmitted(order.localId);
          synced++;
        } catch {
          // Will retry on next online event
        }
      }

      if (synced > 0) {
        toast.success(`${synced} commande(s) synchronisée(s)`);
      }
    } finally {
      syncingRef.current = false;
    }
  };

  useEffect(() => {
    window.addEventListener('online', sync);
    // Also try on mount (in case we're already online after being offline)
    sync();
    return () => window.removeEventListener('online', sync);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
}

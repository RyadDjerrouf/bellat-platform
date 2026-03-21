"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { fetchOrders, cancelOrder, reorderOrder, type Order } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const STATUS_LABELS: Record<string, { fr: string; ar: string; color: string }> = {
  pending:          { fr: 'En attente',       ar: 'في الانتظار',      color: 'bg-yellow-100 text-yellow-800' },
  confirmed:        { fr: 'Confirmée',         ar: 'مؤكد',             color: 'bg-blue-100 text-blue-800' },
  preparing:        { fr: 'En préparation',    ar: 'قيد التحضير',      color: 'bg-purple-100 text-purple-800' },
  out_for_delivery: { fr: 'En livraison',      ar: 'في الطريق إليك',   color: 'bg-orange-100 text-orange-800' },
  delivered:        { fr: 'Livrée',            ar: 'تم التسليم',       color: 'bg-green-100 text-green-800' },
  cancelled:        { fr: 'Annulée',           ar: 'ملغاة',            color: 'bg-red-100 text-red-800' },
};

function StatusBadge({ status, locale }: { status: string; locale: string }) {
  const s = STATUS_LABELS[status] ?? { fr: status, ar: status, color: 'bg-gray-100 text-gray-800' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.color}`}>
      {locale === 'ar' ? s.ar : s.fr}
    </span>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const locale = useLocale();
  const { token, isAuthenticated } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [reordering, setReordering] = useState<string | null>(null);

  const loadOrders = async (status?: string) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const { data, meta } = await fetchOrders(token, { status: status || undefined });
      setOrders(data);
      setTotal(meta.total);
    } catch {
      toast.error('Impossible de charger les commandes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/${locale}/login`);
      return;
    }
    loadOrders();
  }, [isAuthenticated, token, locale, router]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (s: string) => {
    setStatusFilter(s);
    loadOrders(s);
  };

  const handleCancel = async (orderId: string) => {
    setCancelling(orderId);
    try {
      await cancelOrder(token!, orderId);
      toast.success(locale === 'ar' ? 'تم إلغاء الطلب' : 'Commande annulée');
      await loadOrders(statusFilter);
    } catch {
      toast.error(locale === 'ar' ? 'فشل إلغاء الطلب' : "Échec de l'annulation");
    } finally {
      setCancelling(null);
    }
  };

  const handleReorder = async (orderId: string) => {
    setReordering(orderId);
    try {
      const newOrder = await reorderOrder(token!, orderId);
      toast.success(locale === 'ar' ? 'تم إعادة الطلب' : 'Commande recréée !');
      router.push(`/${locale}/order-success?orderId=${newOrder.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setReordering(null);
    }
  };

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale === 'ar' ? 'ar-DZ' : 'fr-DZ', {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(new Date(iso));

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-36" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">
          {locale === 'ar' ? 'طلباتي' : 'Mes commandes'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {locale === 'ar' ? `${total} طلب` : `${total} commande${total !== 1 ? 's' : ''}`}
        </p>
      </header>

      {/* Status filter tabs */}
      {(() => {
        const filters: { value: string; fr: string; ar: string }[] = [
          { value: '', fr: 'Toutes', ar: 'الكل' },
          { value: 'pending', fr: 'En attente', ar: 'في الانتظار' },
          { value: 'confirmed', fr: 'Confirmées', ar: 'مؤكد' },
          { value: 'preparing', fr: 'En préparation', ar: 'قيد التحضير' },
          { value: 'out_for_delivery', fr: 'En livraison', ar: 'في الطريق' },
          { value: 'delivered', fr: 'Livrées', ar: 'تم التسليم' },
          { value: 'cancelled', fr: 'Annulées', ar: 'ملغاة' },
        ];
        return (
          <div className="flex gap-2 flex-wrap mb-6 overflow-x-auto pb-1">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => handleFilterChange(f.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  statusFilter === f.value
                    ? 'bg-green-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {locale === 'ar' ? f.ar : f.fr}
              </button>
            ))}
          </div>
        );
      })()}

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">
            {locale === 'ar' ? 'لا توجد طلبات بعد' : 'Aucune commande pour le moment'}
          </p>
          <Button onClick={() => router.push(`/${locale}/products`)}>
            {locale === 'ar' ? 'تسوق الآن' : 'Commencer vos achats'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-4">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <Link href={`/${locale}/orders/${order.id}`} className="font-mono text-sm font-semibold text-green-700 hover:underline">
                      {order.id}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                  <StatusBadge status={order.status} locale={locale} />
                </div>

                {/* Items */}
                <ul className="text-sm text-gray-600 space-y-0.5 mb-3">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>
                        {locale === 'ar'
                          ? item.product?.nameAr ?? item.productId
                          : item.product?.nameFr ?? item.productId}
                        {' '}×{item.quantity}
                      </span>
                      <span className="text-gray-500">
                        {Number(item.priceAtPurchase) * item.quantity} DZD
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Footer row */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="text-sm">
                    <span className="text-gray-500">
                      {locale === 'ar' ? 'التوصيل: ' : 'Livraison: '}
                    </span>
                    <span>{order.deliveryAddress.wilaya}</span>
                    <span className="mx-2 text-gray-300">·</span>
                    <span className="text-gray-500">{order.deliverySlotTime}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        disabled={cancelling === order.id}
                        className="text-xs text-red-600 hover:underline disabled:opacity-50"
                      >
                        {locale === 'ar' ? 'إلغاء' : 'Annuler'}
                      </button>
                    )}
                    {(order.status === 'delivered' || order.status === 'cancelled') && (
                      <button
                        onClick={() => handleReorder(order.id)}
                        disabled={reordering === order.id}
                        className="text-xs text-green-700 hover:underline disabled:opacity-50"
                      >
                        {reordering === order.id
                          ? '...'
                          : locale === 'ar' ? 'إعادة الطلب' : 'Recommander'}
                      </button>
                    )}
                    <span className="font-bold text-gray-900">{Number(order.total)} DZD</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { toast } from 'sonner';
import { ArrowLeft, MapPin, Calendar, Clock, CreditCard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchOrder, cancelOrder, type Order } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const STATUS_STEPS = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

const STATUS_META: Record<string, { fr: string; ar: string; color: string }> = {
  pending:          { fr: 'En attente',    ar: 'في الانتظار',    color: 'bg-yellow-100 text-yellow-800' },
  confirmed:        { fr: 'Confirmée',     ar: 'مؤكد',           color: 'bg-blue-100 text-blue-800' },
  preparing:        { fr: 'En préparation',ar: 'قيد التحضير',    color: 'bg-purple-100 text-purple-800' },
  out_for_delivery: { fr: 'En livraison',  ar: 'في الطريق',      color: 'bg-orange-100 text-orange-800' },
  delivered:        { fr: 'Livrée',        ar: 'تم التسليم',     color: 'bg-green-100 text-green-800' },
  cancelled:        { fr: 'Annulée',       ar: 'ملغاة',          color: 'bg-red-100 text-red-800' },
};

const STEP_LABELS: Record<string, { fr: string; ar: string }> = {
  pending:          { fr: 'Reçue',         ar: 'تم الاستلام' },
  confirmed:        { fr: 'Confirmée',     ar: 'مؤكدة' },
  preparing:        { fr: 'En préparation',ar: 'قيد التحضير' },
  out_for_delivery: { fr: 'En livraison',  ar: 'في الطريق' },
  delivered:        { fr: 'Livrée',        ar: 'تم التسليم' },
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const locale = useLocale();
  const { token, isAuthenticated } = useAuth();
  const ar = locale === 'ar';

  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.replace(`/${locale}/login`); return; }
    fetchOrder(token!, orderId)
      .then((o) => { if (!o) router.replace(`/${locale}/orders`); else setOrder(o); })
      .finally(() => setIsLoading(false));
  }, [isAuthenticated, token, orderId, locale, router]);

  const handleCancel = async () => {
    if (!order) return;
    setCancelling(true);
    try {
      await cancelOrder(token!, orderId);
      toast.success(ar ? 'تم إلغاء الطلب' : 'Commande annulée');
      const updated = await fetchOrder(token!, orderId);
      if (updated) setOrder(updated);
    } catch {
      toast.error('Erreur');
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(ar ? 'ar-DZ' : 'fr-DZ', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />)}
      </div>
    );
  }

  if (!order) return null;

  const s = STATUS_META[order.status] ?? STATUS_META.pending;
  const currentStepIdx = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="h-4 w-4" />
        {ar ? 'رجوع' : 'Retour'}
      </button>

      <header className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-mono text-xl font-bold text-gray-900">{order.id}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${s.color}`}>
          {ar ? s.ar : s.fr}
        </span>
      </header>

      {/* Status timeline — hidden for cancelled orders */}
      {!isCancelled && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              {STATUS_STEPS.map((step, i) => {
                const done = i <= currentStepIdx;
                const label = STEP_LABELS[step];
                return (
                  <div key={step} className="flex-1 flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors
                      ${done ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300 text-gray-300'}`}>
                      {done ? '✓' : i + 1}
                    </div>
                    <p className={`text-[10px] text-center mt-1 leading-tight ${done ? 'text-green-700 font-medium' : 'text-gray-400'}`}>
                      {ar ? label.ar : label.fr}
                    </p>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`absolute translate-x-[calc(50%+14px)] top-3.5 h-0.5 w-[calc(100%-28px)] -z-10
                        ${i < currentStepIdx ? 'bg-green-500' : 'bg-gray-200'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Items */}
      <Card className="mb-4">
        <CardHeader><CardTitle className="text-base">{ar ? 'المنتجات' : 'Articles'}</CardTitle></CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <li key={item.id} className="px-4 py-3 flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium text-gray-900">
                    {ar ? item.product?.nameAr : item.product?.nameFr} × {item.quantity}
                    {item.product?.unit ? ` (${item.product.unit})` : ''}
                  </p>
                </div>
                <span className="text-gray-700 font-semibold">
                  {(Number(item.priceAtPurchase) * item.quantity).toLocaleString('fr-DZ')} DZD
                </span>
              </li>
            ))}
          </ul>
          <div className="px-4 py-3 border-t bg-gray-50 space-y-1 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>{ar ? 'المجموع الفرعي' : 'Sous-total'}</span>
              <span>{Number(order.subtotal).toLocaleString('fr-DZ')} DZD</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>{ar ? 'التوصيل' : 'Livraison'}</span>
              <span>{Number(order.deliveryFee) === 0 ? (ar ? 'مجاني' : 'Gratuite') : `${Number(order.deliveryFee).toLocaleString('fr-DZ')} DZD`}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-1 border-t">
              <span>{ar ? 'الإجمالي' : 'Total'}</span>
              <span>{Number(order.total).toLocaleString('fr-DZ')} DZD</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery info */}
      <Card className="mb-4">
        <CardHeader><CardTitle className="text-base">{ar ? 'معلومات التوصيل' : 'Livraison'}</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">{order.deliveryAddress.fullName}</p>
              <p className="text-gray-500">{order.deliveryAddress.addressLine1}</p>
              <p className="text-gray-500">{order.deliveryAddress.commune}, {order.deliveryAddress.wilaya}</p>
              <p className="text-gray-400">{order.deliveryAddress.phoneNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{new Intl.DateTimeFormat(ar ? 'ar-DZ' : 'fr-DZ', { dateStyle: 'full' }).format(new Date(order.deliverySlotDate))}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{order.deliverySlotTime}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <CreditCard className="h-4 w-4 text-gray-400" />
            <span>{ar ? 'الدفع عند الاستلام' : 'Paiement à la livraison'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {order.status === 'pending' && (
        <Button
          variant="secondary"
          className="w-full border-red-200 text-red-600 hover:bg-red-50"
          onClick={handleCancel}
          disabled={cancelling}
        >
          {cancelling ? '...' : ar ? 'إلغاء الطلب' : 'Annuler la commande'}
        </Button>
      )}
    </div>
  );
}

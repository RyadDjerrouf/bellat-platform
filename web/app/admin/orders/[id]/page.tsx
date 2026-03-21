"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, MapPin, Calendar, Clock, User, Phone, Mail } from 'lucide-react';
import { fetchAdminOrder, adminUpdateOrderStatus, type AdminOrder } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const ADMIN_TOKEN_KEY = 'bellat_admin_token';

const NEXT_STATUS: Record<string, string | null> = {
  pending: 'confirmed', confirmed: 'preparing', preparing: 'out_for_delivery',
  out_for_delivery: 'delivered', delivered: null, cancelled: null,
};

const STATUS_META: Record<string, { label: string; variant: 'warning' | 'info' | 'success' | 'danger' | 'default' }> = {
  pending:          { label: 'En attente',   variant: 'warning' },
  confirmed:        { label: 'Confirmé',     variant: 'info' },
  preparing:        { label: 'Préparation',  variant: 'info' },
  out_for_delivery: { label: 'En livraison', variant: 'warning' },
  delivered:        { label: 'Livré',        variant: 'success' },
  cancelled:        { label: 'Annulé',       variant: 'danger' },
};

const NEXT_LABEL: Record<string, string> = {
  confirmed: 'Confirmer', preparing: 'Mettre en préparation',
  out_for_delivery: 'Partir en livraison', delivered: 'Marquer comme livré',
};

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);

  const load = async () => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;
    const o = await fetchAdminOrder(token, id);
    setOrder(o);
    setIsLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const handleAdvance = async () => {
    if (!order) return;
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;
    setAdvancing(true);
    try {
      await adminUpdateOrderStatus(token, order.id, next);
      toast.success(`→ ${STATUS_META[next]?.label}`);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setAdvancing(false);
    }
  };

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat('fr-DZ', { dateStyle: 'full' }).format(new Date(iso));

  const formatShort = (iso: string) =>
    new Intl.DateTimeFormat('fr-DZ', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />)}
      </div>
    );
  }

  if (!order) return <p className="text-gray-500">Commande introuvable.</p>;

  const s = STATUS_META[order.status] ?? { label: order.status, variant: 'default' as const };
  const next = NEXT_STATUS[order.status];

  return (
    <div className="max-w-3xl">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4" /> Retour
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-mono text-2xl font-bold text-gray-900">{order.id}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{formatShort(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={s.variant}>{s.label}</Badge>
          {next && (
            <button
              onClick={handleAdvance}
              disabled={advancing}
              className="bg-green-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-800 disabled:opacity-50 transition-colors"
            >
              {advancing ? '...' : `→ ${NEXT_LABEL[next] ?? next}`}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Customer */}
        <Card>
          <CardHeader><CardTitle className="text-sm text-gray-600">Client</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><User className="h-4 w-4 text-gray-400" /><span className="font-medium">{order.customer.fullName}</span></div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" /><span className="text-gray-600">{order.customer.email}</span></div>
            {order.customer.phoneNumber && (
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400" /><span className="text-gray-600">{order.customer.phoneNumber}</span></div>
            )}
          </CardContent>
        </Card>

        {/* Delivery */}
        <Card>
          <CardHeader><CardTitle className="text-sm text-gray-600">Livraison</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">{order.deliveryAddress.fullName}</p>
                <p className="text-gray-500">{order.deliveryAddress.addressLine1}</p>
                <p className="text-gray-500">{order.deliveryAddress.commune}, {order.deliveryAddress.wilaya}</p>
              </div>
            </div>
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-400" /><span>{formatDate(order.deliverySlotDate)}</span></div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-gray-400" /><span>{order.deliverySlotTime}</span></div>
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card>
        <CardHeader><CardTitle className="text-sm text-gray-600">Articles</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Produit', 'Qté', 'Prix unitaire', 'Total'].map((h) => (
                  <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {item.product?.nameFr ?? item.productId}
                    {item.product?.unit && <span className="text-gray-400 text-xs ml-1">({item.product.unit})</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.quantity}</td>
                  <td className="px-4 py-3 text-gray-600">{Number(item.priceAtPurchase).toLocaleString('fr-DZ')} DZD</td>
                  <td className="px-4 py-3 font-semibold">{(Number(item.priceAtPurchase) * item.quantity).toLocaleString('fr-DZ')} DZD</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t">
              <tr>
                <td colSpan={3} className="px-4 py-2 text-right text-sm font-semibold text-gray-600">Sous-total</td>
                <td className="px-4 py-2 font-semibold">{Number(order.subtotal).toLocaleString('fr-DZ')} DZD</td>
              </tr>
              <tr>
                <td colSpan={3} className="px-4 py-2 text-right text-sm text-gray-500">Livraison</td>
                <td className="px-4 py-2 text-gray-500">{Number(order.deliveryFee) === 0 ? 'Gratuite' : `${Number(order.deliveryFee).toLocaleString('fr-DZ')} DZD`}</td>
              </tr>
              <tr>
                <td colSpan={3} className="px-4 py-2 text-right font-bold text-gray-900">Total</td>
                <td className="px-4 py-2 font-bold text-green-700 text-base">{Number(order.total).toLocaleString('fr-DZ')} DZD</td>
              </tr>
            </tfoot>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

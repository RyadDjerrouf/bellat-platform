"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { ShoppingCart, DollarSign, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { fetchAdminOrders, fetchAdminInventory, fetchAdminAnalytics, type AdminOrder, type AnalyticsSummary } from '@/lib/api';

const ADMIN_TOKEN_KEY = 'bellat_admin_token';

const STATUS_LABELS: Record<string, { label: string; variant: 'warning' | 'info' | 'success' | 'danger' | 'default' }> = {
  pending:          { label: 'En attente',    variant: 'warning' },
  confirmed:        { label: 'Confirmé',      variant: 'info' },
  preparing:        { label: 'Préparation',   variant: 'info' },
  out_for_delivery: { label: 'En livraison',  variant: 'warning' },
  delivered:        { label: 'Livré',         variant: 'success' },
  cancelled:        { label: 'Annulé',        variant: 'danger' },
};

export default function AdminDashboardPage() {
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);
  const [summary, setSummary] = useState({ total: 0, pending: 0, revenue: 0, lowStock: 0, outOfStock: 0 });
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;

    Promise.all([
      fetchAdminOrders(token, { page: 1 }),
      fetchAdminInventory(token, { limit: 1 }),
      fetchAdminAnalytics(token),
    ]).then(([ordersRes, inventoryRes, analyticsRes]) => {
      const orders = ordersRes.data;
      const pending = orders.filter((o) => o.status === 'pending').length;
      const revenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
      setRecentOrders(orders.slice(0, 5));
      setSummary({
        total: ordersRes.meta.total,
        pending,
        revenue,
        lowStock: inventoryRes.summary.lowStock,
        outOfStock: inventoryRes.summary.outOfStock,
      });
      setAnalytics(analyticsRes);
    }).finally(() => setIsLoading(false));
  }, []);

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat('fr-DZ', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Vue d&apos;ensemble de votre activité</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Total commandes</p>
                <p className="text-4xl font-bold text-gray-900">{isLoading ? '—' : summary.total}</p>
              </div>
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Revenus (total)</p>
                <p className="text-3xl font-bold text-gray-900">{isLoading ? '—' : summary.revenue.toLocaleString('fr-DZ')}</p>
                <p className="text-sm text-gray-500 mt-1">DZD</p>
              </div>
              <div className="w-12 h-12 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">En attente</p>
                <p className="text-4xl font-bold text-gray-900">{isLoading ? '—' : summary.pending}</p>
                {!isLoading && summary.pending > 0 && (
                  <p className="text-sm text-amber-600 mt-1 font-medium">Nécessite attention</p>
                )}
              </div>
              <div className="w-12 h-12 bg-linear-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Stock faible / épuisé</p>
                <p className="text-4xl font-bold text-gray-900">
                  {isLoading ? '—' : `${summary.lowStock} / ${summary.outOfStock}`}
                </p>
                <Link href="/admin/inventory" className="text-xs text-red-600 mt-1 hover:underline">
                  Gérer l&apos;inventaire →
                </Link>
              </div>
              <div className="w-12 h-12 bg-linear-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Revenue Chart — last 14 days */}
      <Card className="border-0 shadow-lg mb-8">
        <CardHeader className="border-b bg-linear-to-r from-gray-50 to-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Revenus journaliers</CardTitle>
              <p className="text-sm text-gray-600 mt-1">14 derniers jours (DZD)</p>
            </div>
            <Link href="/admin/analytics" className="text-green-600 hover:text-green-700 text-sm font-medium">
              Voir tout →
            </Link>
          </div>
        </CardHeader>
        <CardContent className="px-6 py-5">
          {isLoading || !analytics ? (
            <div className="h-28 bg-gray-100 rounded animate-pulse" />
          ) : analytics.dailyRevenue.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Aucune donnée</p>
          ) : (() => {
            const days = analytics.dailyRevenue.slice(-14);
            const maxRev = Math.max(...days.map((d) => d.revenue), 1);
            return (
              <div className="flex items-end gap-1 h-28">
                {days.map((d) => (
                  <div key={d.date} className="flex-1 flex flex-col items-center justify-end group relative">
                    <div
                      className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors"
                      style={{ height: `${(d.revenue / maxRev) * 100}%`, minHeight: 2 }}
                    />
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                      {d.date.slice(5)}: {d.revenue.toLocaleString('fr-DZ')} DZD
                    </div>
                    <span className="text-[8px] text-gray-400 mt-1 hidden sm:block">{d.date.slice(8)}</span>
                  </div>
                ))}
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Top Products */}
      {analytics && analytics.topProducts.length > 0 && (
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader className="border-b bg-linear-to-r from-gray-50 to-white px-6 py-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <CardTitle className="text-xl font-bold text-gray-900">Top produits</CardTitle>
              <span className="text-sm text-gray-500 ml-1">par chiffre d&apos;affaires</span>
            </div>
          </CardHeader>
          <CardContent className="px-6 py-4 space-y-3">
            {(() => {
              const maxRev = Math.max(...analytics.topProducts.map((p) => p.revenue), 1);
              return analytics.topProducts.map((p, i) => (
                <div key={p.productId}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">
                      <span className="text-gray-400 mr-2 font-mono">#{i + 1}</span>
                      {p.nameFr}
                      <span className="text-xs text-gray-400 ml-2">({p.orderCount} cmd)</span>
                    </span>
                    <span className="font-semibold text-gray-900">{p.revenue.toLocaleString('fr-DZ')} DZD</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${(p.revenue / maxRev) * 100}%` }} />
                  </div>
                </div>
              ));
            })()}
          </CardContent>
        </Card>
      )}

      {/* Recent Orders Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b bg-linear-to-r from-gray-50 to-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Commandes récentes</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Dernières transactions</p>
            </div>
            <Link href="/admin/orders" className="text-green-600 hover:text-green-700 text-sm font-medium">
              Voir tout →
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  {['N° Commande', 'Client', 'Date', 'Montant', 'Statut'].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(5)].map((_, j) => (
                        <td key={j} className="px-6 py-5">
                          <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : recentOrders.map((order) => {
                  const s = STATUS_LABELS[order.status] ?? { label: order.status, variant: 'default' as const };
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5 whitespace-nowrap font-mono text-sm font-semibold text-green-700">{order.id}</td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                            {order.customer.fullName.charAt(0)}
                          </div>
                          <span className="text-sm text-gray-900">{order.customer.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {Number(order.total).toLocaleString('fr-DZ')} DZD
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <Badge variant={s.variant}>{s.label}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

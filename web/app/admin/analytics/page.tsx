"use client";

import { useEffect, useState } from 'react';
import { TrendingUp, ShoppingCart, DollarSign, Package } from 'lucide-react';
import { fetchAdminAnalytics, type AnalyticsSummary } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const ADMIN_TOKEN_KEY = 'bellat_admin_token';

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente', confirmed: 'Confirmées', preparing: 'En préparation',
  out_for_delivery: 'En livraison', delivered: 'Livrées', cancelled: 'Annulées',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-400', confirmed: 'bg-blue-400', preparing: 'bg-purple-400',
  out_for_delivery: 'bg-orange-400', delivered: 'bg-green-500', cancelled: 'bg-red-400',
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;
    fetchAdminAnalytics(token).then((res) => {
      setData(res);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-200 rounded-xl animate-pulse" />)}
      </div>
    );
  }

  if (!data) return <p className="text-gray-500">Impossible de charger les données.</p>;

  const maxRevenue = Math.max(...data.dailyRevenue.map((d) => d.revenue), 1);
  const totalByStatus = Object.values(data.ordersByStatus).reduce((a, b) => a + b, 0) || 1;
  const maxProductRevenue = Math.max(...data.topProducts.map((p) => p.revenue), 1);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytique</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg"><ShoppingCart className="h-5 w-5 text-blue-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Total commandes</p>
              <p className="text-xl font-bold">{data.totalOrders.toLocaleString('fr-DZ')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg"><DollarSign className="h-5 w-5 text-green-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Chiffre d'affaires</p>
              <p className="text-xl font-bold">{data.totalRevenue.toLocaleString('fr-DZ')} DZD</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg"><TrendingUp className="h-5 w-5 text-green-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Livrées</p>
              <p className="text-xl font-bold">{data.ordersByStatus['delivered'] ?? 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg"><Package className="h-5 w-5 text-yellow-600" /></div>
            <div>
              <p className="text-xs text-gray-500">En attente</p>
              <p className="text-xl font-bold">{data.ordersByStatus['pending'] ?? 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily revenue bar chart (last 30 days) */}
        <Card>
          <CardHeader><CardTitle className="text-sm text-gray-600">Revenus journaliers (30 derniers jours)</CardTitle></CardHeader>
          <CardContent>
            {data.dailyRevenue.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Aucune donnée</p>
            ) : (
              <div className="flex items-end gap-0.5 h-40">
                {data.dailyRevenue.map((d) => (
                  <div key={d.date} className="flex-1 flex flex-col items-center justify-end group relative">
                    <div
                      className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors"
                      style={{ height: `${(d.revenue / maxRevenue) * 100}%`, minHeight: 2 }}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                      {d.date.slice(5)}: {d.revenue.toLocaleString('fr-DZ')} DZD
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders by status */}
        <Card>
          <CardHeader><CardTitle className="text-sm text-gray-600">Répartition par statut</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(data.ordersByStatus)
              .sort((a, b) => b[1] - a[1])
              .map(([status, count]) => (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{STATUS_LABELS[status] ?? status}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${STATUS_COLORS[status] ?? 'bg-gray-400'}`}
                      style={{ width: `${(count / totalByStatus) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Top products */}
      <Card>
        <CardHeader><CardTitle className="text-sm text-gray-600">Top 5 produits par chiffre d'affaires</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {data.topProducts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Aucune donnée</p>
          ) : (
            data.topProducts.map((p, i) => (
              <div key={p.productId}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">
                    <span className="text-gray-400 mr-2">#{i + 1}</span>{p.nameFr}
                    <span className="text-xs text-gray-400 ml-2">({p.orderCount} cmd)</span>
                  </span>
                  <span className="font-semibold">{p.revenue.toLocaleString('fr-DZ')} DZD</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${(p.revenue / maxProductRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

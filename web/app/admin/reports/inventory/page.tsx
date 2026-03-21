"use client";

import { useEffect, useState } from 'react';
import { Package, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import {
  fetchAdminInventory,
  fetchAdminInventoryAlerts,
  type InventoryAlerts,
  type InventoryResponse,
} from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const ADMIN_TOKEN_KEY = 'bellat_admin_token';

const STOCK_LABELS: Record<string, string> = {
  in_stock: 'En stock',
  low_stock: 'Stock faible',
  out_of_stock: 'Rupture',
};

const STOCK_COLORS: Record<string, string> = {
  in_stock: 'bg-green-100 text-green-800',
  low_stock: 'bg-yellow-100 text-yellow-800',
  out_of_stock: 'bg-red-100 text-red-800',
};

export default function InventoryReportPage() {
  const [summary, setSummary] = useState<InventoryResponse['summary'] | null>(null);
  const [alerts, setAlerts] = useState<InventoryAlerts | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;
    Promise.all([
      fetchAdminInventory(token, { limit: 1 }), // just need summary
      fetchAdminInventoryAlerts(token),
    ]).then(([inv, al]) => {
      setSummary(inv.summary);
      setAlerts(al);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-gray-200 rounded-xl animate-pulse" />)}
      </div>
    );
  }

  if (!summary || !alerts) return <p className="text-gray-500">Impossible de charger les données.</p>;

  const totalProducts = summary.inStock + summary.lowStock + summary.outOfStock;
  const outOfStockProducts = alerts.products.filter((p) => p.stockStatus === 'out_of_stock');
  const lowStockProducts = alerts.products.filter((p) => p.stockStatus === 'low_stock');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Rapport inventaire</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg"><CheckCircle className="h-5 w-5 text-green-600" /></div>
            <div>
              <p className="text-xs text-gray-500">En stock</p>
              <p className="text-2xl font-bold text-green-700">{summary.inStock}</p>
              <p className="text-xs text-gray-400">
                {totalProducts > 0 ? Math.round((summary.inStock / totalProducts) * 100) : 0}% des produits
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg"><AlertTriangle className="h-5 w-5 text-yellow-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Stock faible</p>
              <p className="text-2xl font-bold text-yellow-700">{summary.lowStock}</p>
              <p className="text-xs text-gray-400">Réapprovisionnement recommandé</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg"><XCircle className="h-5 w-5 text-red-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Rupture de stock</p>
              <p className="text-2xl font-bold text-red-700">{summary.outOfStock}</p>
              <p className="text-xs text-gray-400">Action immédiate requise</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock distribution bar */}
      {totalProducts > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Répartition du stock ({totalProducts} produits actifs)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-6 rounded-full overflow-hidden gap-0.5">
              {summary.inStock > 0 && (
                <div
                  className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${(summary.inStock / totalProducts) * 100}%` }}
                  title={`En stock: ${summary.inStock}`}
                >
                  {Math.round((summary.inStock / totalProducts) * 100)}%
                </div>
              )}
              {summary.lowStock > 0 && (
                <div
                  className="bg-yellow-400 flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${(summary.lowStock / totalProducts) * 100}%` }}
                  title={`Faible: ${summary.lowStock}`}
                >
                  {Math.round((summary.lowStock / totalProducts) * 100)}%
                </div>
              )}
              {summary.outOfStock > 0 && (
                <div
                  className="bg-red-500 flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${(summary.outOfStock / totalProducts) * 100}%` }}
                  title={`Rupture: ${summary.outOfStock}`}
                >
                  {Math.round((summary.outOfStock / totalProducts) * 100)}%
                </div>
              )}
            </div>
            <div className="flex gap-6 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> En stock</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" /> Faible</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Rupture</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Out of stock — priority list */}
      {outOfStockProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Produits en rupture ({outOfStockProducts.length})
              <span className="ml-auto text-xs font-normal text-red-600">Action immédiate</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-100">
              {outOfStockProducts.map((p) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{p.nameFr}</p>
                    <p className="text-xs text-gray-400">{p.nameAr}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STOCK_COLORS[p.stockStatus]}`}>
                      {STOCK_LABELS[p.stockStatus]}
                    </span>
                    <span className="text-xs text-gray-400">
                      Modifié {new Date(p.updatedAt).toLocaleDateString('fr-DZ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Low stock — reorder recommendations */}
      {lowStockProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Produits à réapprovisionner ({lowStockProducts.length})
              <span className="ml-auto text-xs font-normal text-yellow-600">Recommandé</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-100">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{p.nameFr}</p>
                    <p className="text-xs text-gray-400">{p.nameAr}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STOCK_COLORS[p.stockStatus]}`}>
                      {STOCK_LABELS[p.stockStatus]}
                    </span>
                    <span className="text-xs text-gray-400">
                      Modifié {new Date(p.updatedAt).toLocaleDateString('fr-DZ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {alerts.total === 0 && (
        <Card>
          <CardContent className="py-10 flex flex-col items-center gap-3 text-center">
            <Package className="h-10 w-10 text-green-400" />
            <p className="text-gray-600 font-medium">Tous les produits sont en stock</p>
            <p className="text-sm text-gray-400">Aucune alerte de stock pour le moment.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'sonner';
import { fetchAdminInventory, adminUpdateStock, adminImportInventoryCsv, type InventoryProduct, type InventoryResponse } from '@/lib/api';
import { AlertTriangle, CheckCircle, Upload, XCircle } from 'lucide-react';

const ADMIN_TOKEN_KEY = 'bellat_admin_token';

const STOCK_META: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  in_stock:     { label: 'En stock', variant: 'success' },
  low_stock:    { label: 'Faible',   variant: 'warning' },
  out_of_stock: { label: 'Rupture',  variant: 'danger' },
};

const STOCK_STATUSES = ['in_stock', 'low_stock', 'out_of_stock'] as const;
const FILTERS = ['', 'low_stock', 'out_of_stock'] as const;
const FILTER_LABELS: Record<string, string> = { '': 'Tous', low_stock: 'Faible stock', out_of_stock: 'Rupture' };

export default function AdminInventoryPage() {
  const [data, setData] = useState<InventoryResponse | null>(null);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const load = async (stockStatus?: string) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;
    setIsLoading(true);
    const res = await fetchAdminInventory(token, { stockStatus, limit: 100 });
    setData(res);
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleFilterChange = (s: string) => {
    setFilter(s);
    load(s || undefined);
  };

  const handleStockChange = async (productId: string, stockStatus: string) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;
    setUpdating(productId);
    try {
      await adminUpdateStock(token, productId, stockStatus);
      // Update local state without full reload
      setData((prev) => {
        if (!prev) return prev;
        const updated = prev.data.map((p) =>
          p.id === productId ? { ...p, stockStatus: stockStatus as InventoryProduct['stockStatus'] } : p
        );
        // Recompute summary
        const inStock = updated.filter((p) => p.stockStatus === 'in_stock').length;
        const lowStock = updated.filter((p) => p.stockStatus === 'low_stock').length;
        const outOfStock = updated.filter((p) => p.stockStatus === 'out_of_stock').length;
        return { ...prev, data: updated, summary: { inStock, lowStock, outOfStock } };
      });
      toast.success('Stock mis à jour');
    } catch {
      toast.error('Erreur mise à jour');
    } finally {
      setUpdating(null);
    }
  };

  const summary = data?.summary ?? { inStock: 0, lowStock: 0, outOfStock: 0 };
  const products = data?.data ?? [];

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Inventaire</h1>
          <p className="text-gray-500 mt-1">Gérez le statut de stock de vos produits</p>
        </div>
        <label className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors ${importing ? 'bg-gray-100 text-gray-400' : 'bg-green-600 text-white hover:bg-green-700'}`}>
          <Upload className="h-4 w-4" />
          {importing ? 'Import en cours...' : 'Importer CSV'}
          <input
            type="file"
            accept=".csv"
            className="hidden"
            disabled={importing}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const token = localStorage.getItem(ADMIN_TOKEN_KEY);
              if (!token) return;
              setImporting(true);
              try {
                const result = await adminImportInventoryCsv(token, file);
                if (result) {
                  toast.success(`${result.updated} produit(s) mis à jour, ${result.skipped} ignoré(s)`);
                  if (result.errors.length > 0) toast.warning(`Erreurs: ${result.errors.slice(0, 3).join(', ')}`);
                  load(filter || undefined);
                } else {
                  toast.error('Erreur lors de l\'import');
                }
              } finally {
                setImporting(false);
                e.target.value = '';
              }
            }}
          />
        </label>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{isLoading ? '—' : summary.inStock}</p>
              <p className="text-sm text-gray-500">En stock</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{isLoading ? '—' : summary.lowStock}</p>
              <p className="text-sm text-gray-500">Stock faible</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{isLoading ? '—' : summary.outOfStock}</p>
              <p className="text-sm text-gray-500">Rupture de stock</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => handleFilterChange(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader className="border-b px-4 py-3">
          <CardTitle className="text-base font-semibold text-gray-700">
            {products.length} produit{products.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {['ID', 'Produit', 'Catégorie', 'Prix', 'Statut stock', 'Modifier'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {isLoading ? (
                  [...Array(8)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400">Aucun produit</td>
                  </tr>
                ) : products.map((product) => {
                  const s = STOCK_META[product.stockStatus];
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">{product.id}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{product.nameFr}</p>
                        <p className="text-xs text-gray-400">{product.nameAr}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{product.categoryId ?? '—'}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {Number(product.price).toLocaleString('fr-DZ')} DZD
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={s.variant}>{s.label}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={product.stockStatus}
                          disabled={updating === product.id}
                          onChange={(e) => handleStockChange(product.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded px-2 py-1.5 text-gray-700 bg-white hover:border-gray-400 disabled:opacity-50 cursor-pointer"
                        >
                          {STOCK_STATUSES.map((s) => (
                            <option key={s} value={s}>{STOCK_META[s].label}</option>
                          ))}
                        </select>
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

"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'sonner';
import { fetchAdminInventory, adminUpdateStock, adminDeleteProduct, type InventoryProduct } from '@/lib/api';

const ADMIN_TOKEN_KEY = 'bellat_admin_token';

const STOCK_META: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  in_stock:    { label: 'En stock', variant: 'success' },
  low_stock:   { label: 'Faible',   variant: 'warning' },
  out_of_stock:{ label: 'Rupture',  variant: 'danger' },
};

const STOCK_STATUSES = ['in_stock', 'low_stock', 'out_of_stock'] as const;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = async (q?: string) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;
    setIsLoading(true);
    const res = await fetchAdminInventory(token, { limit: 100, q: q || undefined });
    setProducts(res.data);
    setTotal(res.meta.total);
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => load(value), 350);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm(`Désactiver le produit "${productId}" ?`)) return;
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;
    setDeleting(productId);
    try {
      await adminDeleteProduct(token, productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setTotal((t) => t - 1);
      toast.success('Produit désactivé');
    } catch {
      toast.error('Erreur suppression');
    } finally {
      setDeleting(null);
    }
  };

  const handleStockChange = async (productId: string, stockStatus: string) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;
    setUpdating(productId);
    try {
      await adminUpdateStock(token, productId, stockStatus);
      setProducts((prev) =>
        prev.map((p) => p.id === productId ? { ...p, stockStatus: stockStatus as InventoryProduct['stockStatus'] } : p)
      );
      toast.success('Stock mis à jour');
    } catch {
      toast.error('Erreur mise à jour stock');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Produits <span className="text-gray-400 text-xl ml-2">{total}</span></h1>
        <div className="flex items-center gap-3">
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-green-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-800 transition-colors whitespace-nowrap"
          >
            <Plus className="h-4 w-4" /> Ajouter un produit
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['ID', 'Nom', 'Catégorie', 'Prix', 'Unité', 'Stock', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {isLoading ? (
                  [...Array(8)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(7)].map((_, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : products.map((product) => {
                  const s = STOCK_META[product.stockStatus];
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{product.id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.nameFr}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{product.categoryId ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-semibold">
                        {Number(product.price).toLocaleString('fr-DZ')} DZD
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{product.unit ?? '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Badge variant={s.variant}>{s.label}</Badge>
                          <select
                            value={product.stockStatus}
                            disabled={updating === product.id}
                            onChange={(e) => handleStockChange(product.id, e.target.value)}
                            className="text-xs border border-gray-200 rounded px-1.5 py-1 text-gray-600 bg-white hover:border-gray-400 disabled:opacity-50"
                          >
                            {STOCK_STATUSES.map((s) => (
                              <option key={s} value={s}>{STOCK_META[s].label}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-1.5 text-gray-400 hover:text-green-700 transition-colors"
                            title="Modifier"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            disabled={deleting === product.id}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                            title="Désactiver"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
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

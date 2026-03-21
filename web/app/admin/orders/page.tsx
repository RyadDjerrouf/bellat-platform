"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'sonner';
import { Search, CalendarDays } from 'lucide-react';
import { fetchAdminOrders, adminUpdateOrderStatus, type AdminOrder } from '@/lib/api';

const ADMIN_TOKEN_KEY = 'bellat_admin_token';

// State machine — same order as backend VALID_TRANSITIONS
const NEXT_STATUS: Record<string, string | null> = {
  pending:          'confirmed',
  confirmed:        'preparing',
  preparing:        'out_for_delivery',
  out_for_delivery: 'delivered',
  delivered:        null,
  cancelled:        null,
};

const STATUS_META: Record<string, { label: string; variant: 'warning' | 'info' | 'success' | 'danger' | 'default' }> = {
  pending:          { label: 'En attente',   variant: 'warning' },
  confirmed:        { label: 'Confirmé',     variant: 'info' },
  preparing:        { label: 'Préparation',  variant: 'info' },
  out_for_delivery: { label: 'En livraison', variant: 'warning' },
  delivered:        { label: 'Livré',        variant: 'success' },
  cancelled:        { label: 'Annulé',       variant: 'danger' },
};

const STATUS_FILTERS = ['', 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
const STATUS_FILTER_LABELS: Record<string, string> = {
  '': 'Tous', pending: 'En attente', confirmed: 'Confirmé', preparing: 'Préparation',
  out_for_delivery: 'En livraison', delivered: 'Livré', cancelled: 'Annulé',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [advancing, setAdvancing] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadOrders = useCallback(async (
    status?: string, q?: string, from?: string, to?: string,
  ) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;
    setIsLoading(true);
    const res = await fetchAdminOrders(token, {
      status: status || undefined,
      q: q || undefined,
      from: from || undefined,
      to: to || undefined,
    });
    setOrders(res.data);
    setTotal(res.meta.total);
    setIsLoading(false);
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const handleFilterChange = (s: string) => {
    setStatusFilter(s);
    loadOrders(s, searchQuery, dateFrom, dateTo);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => loadOrders(statusFilter, value, dateFrom, dateTo), 350);
  };

  const handleDateChange = (from: string, to: string) => {
    setDateFrom(from);
    setDateTo(to);
    loadOrders(statusFilter, searchQuery, from, to);
  };

  const clearDates = () => handleDateChange('', '');

  const handleAdvance = async (order: AdminOrder) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;
    setAdvancing(order.id);
    try {
      await adminUpdateOrderStatus(token, order.id, next);
      toast.success(`${order.id} → ${STATUS_META[next]?.label ?? next}`);
      await loadOrders(statusFilter);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setAdvancing(null);
    }
  };

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat('fr-DZ', { day: 'numeric', month: 'short' }).format(new Date(iso));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Commandes <span className="text-gray-400 text-xl ml-2">{total}</span></h1>
        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="N° commande ou client..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Date range filter */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <CalendarDays className="h-4 w-4 text-gray-400 shrink-0" />
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => handleDateChange(e.target.value, dateTo)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <span className="text-gray-400 text-sm">→</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => handleDateChange(dateFrom, e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {(dateFrom || dateTo) && (
          <button onClick={clearDates} className="text-xs text-gray-500 hover:text-red-500 transition-colors">
            Effacer
          </button>
        )}
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => handleFilterChange(s)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statusFilter === s
                ? 'bg-green-700 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {STATUS_FILTER_LABELS[s]}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['N°', 'Client', 'Date', 'Wilaya', 'Total', 'Statut', 'Action'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {isLoading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(7)].map((_, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">Aucune commande</td>
                  </tr>
                ) : orders.map((order) => {
                  const s = STATUS_META[order.status] ?? { label: order.status, variant: 'default' as const };
                  const next = NEXT_STATUS[order.status];
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap font-mono text-xs font-semibold text-green-700">{order.id}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{order.customer.fullName}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{order.deliveryAddress.wilaya}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {Number(order.total).toLocaleString('fr-DZ')} DZD
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge variant={s.variant}>{s.label}</Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {next && (
                          <button
                            onClick={() => handleAdvance(order)}
                            disabled={advancing === order.id}
                            className="text-xs bg-green-700 text-white px-3 py-1.5 rounded-lg hover:bg-green-800 disabled:opacity-50 transition-colors"
                          >
                            {advancing === order.id ? '...' : `→ ${STATUS_META[next]?.label ?? next}`}
                          </button>
                        )}
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

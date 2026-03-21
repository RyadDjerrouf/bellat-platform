"use client";

import { useEffect, useState } from 'react';
import { Users, UserCheck, UserPlus, TrendingUp } from 'lucide-react';
import { fetchAdminCustomerStats, type CustomerStats } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const ADMIN_TOKEN_KEY = 'bellat_admin_token';

export default function CustomerReportPage() {
  const [data, setData] = useState<CustomerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;
    fetchAdminCustomerStats(token).then((res) => {
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

  const maxCount = Math.max(...data.dailyRegistrations.map((d) => d.count), 1);
  const engagementRate = data.totalCustomers > 0
    ? Math.round((data.activeCustomers / data.totalCustomers) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Rapport clients</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg"><Users className="h-5 w-5 text-blue-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Total clients</p>
              <p className="text-xl font-bold">{data.totalCustomers.toLocaleString('fr-DZ')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg"><UserCheck className="h-5 w-5 text-green-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Clients actifs</p>
              <p className="text-xl font-bold">{data.activeCustomers.toLocaleString('fr-DZ')}</p>
              <p className="text-xs text-gray-400">(avec ≥1 commande)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg"><UserPlus className="h-5 w-5 text-purple-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Nouveaux ce mois</p>
              <p className="text-xl font-bold">{data.newThisMonth.toLocaleString('fr-DZ')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg"><TrendingUp className="h-5 w-5 text-orange-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Taux d&apos;engagement</p>
              <p className="text-xl font-bold">{engagementRate}%</p>
              <p className="text-xs text-gray-400">(actifs / total)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily registrations chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-gray-600">
            Nouvelles inscriptions (30 derniers jours)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.dailyRegistrations.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Aucune inscription sur cette période</p>
          ) : (
            <div className="flex items-end gap-1 h-40">
              {data.dailyRegistrations.map((d) => (
                <div key={d.date} className="flex-1 flex flex-col items-center justify-end group relative">
                  <div
                    className="w-full bg-purple-500 rounded-t hover:bg-purple-600 transition-colors"
                    style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: 4 }}
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                    {d.date.slice(5)}: {d.count} inscription{d.count > 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Engagement breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-gray-600">Répartition des clients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">Clients actifs (≥1 commande)</span>
              <span className="font-semibold">{data.activeCustomers} ({engagementRate}%)</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${engagementRate}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">Clients sans commande</span>
              <span className="font-semibold">
                {data.totalCustomers - data.activeCustomers} ({100 - engagementRate}%)
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-400 rounded-full"
                style={{ width: `${100 - engagementRate}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

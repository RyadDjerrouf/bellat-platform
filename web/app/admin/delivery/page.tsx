"use client";

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { fetchAdminDeliveryZones, updateDeliveryZone, type DeliveryZone } from '@/lib/api';

const ADMIN_TOKEN_KEY = 'bellat_admin_token';

export default function AdminDeliveryPage() {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  // Track pending edits per zone: { [id]: { fee: string, active: boolean } }
  const [edits, setEdits] = useState<Record<number, { fee: string; active: boolean }>>({});
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;
    fetchAdminDeliveryZones(token)
      .then((data) => {
        setZones(data);
        // Init edits from current DB values
        const init: Record<number, { fee: string; active: boolean }> = {};
        data.forEach((z) => { init[z.id] = { fee: String(z.deliveryFee), active: z.isActive }; });
        setEdits(init);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (zone: DeliveryZone) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;
    const edit = edits[zone.id];
    const fee = Number(edit.fee);
    if (isNaN(fee) || fee < 0) { toast.error('Frais invalide'); return; }

    setSaving(zone.id);
    try {
      const updated = await updateDeliveryZone(token, zone.id, fee, edit.active);
      setZones((prev) => prev.map((z) => (z.id === updated.id ? updated : z)));
      toast.success(`${zone.wilaya} mis à jour`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(null);
    }
  };

  const isDirty = (zone: DeliveryZone) => {
    const edit = edits[zone.id];
    if (!edit) return false;
    return Number(edit.fee) !== zone.deliveryFee || edit.active !== zone.isActive;
  };

  if (loading) {
    return <div className="text-gray-500 py-8 text-center">Chargement...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Zones de livraison</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configurez les frais de livraison par wilaya. Laissez 0 pour la livraison gratuite.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Wilaya</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Frais (DZD)</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Active</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {zones.map((zone) => {
              const edit = edits[zone.id] ?? { fee: String(zone.deliveryFee), active: zone.isActive };
              const dirty = isDirty(zone);
              return (
                <tr key={zone.id} className={dirty ? 'bg-amber-50' : 'hover:bg-gray-50'}>
                  <td className="px-4 py-2.5 font-medium text-gray-800">{zone.wilaya}</td>
                  <td className="px-4 py-2.5">
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={edit.fee}
                      onChange={(e) =>
                        setEdits((prev) => ({ ...prev, [zone.id]: { ...edit, fee: e.target.value } }))
                      }
                      className="w-24 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <input
                      type="checkbox"
                      checked={edit.active}
                      onChange={(e) =>
                        setEdits((prev) => ({ ...prev, [zone.id]: { ...edit, active: e.target.checked } }))
                      }
                      className="h-4 w-4 accent-green-600"
                    />
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {dirty && (
                      <button
                        onClick={() => handleSave(zone)}
                        disabled={saving === zone.id}
                        className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {saving === zone.id ? '...' : 'Sauvegarder'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

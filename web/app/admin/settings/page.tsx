"use client";

import { useEffect, useState } from 'react';
import { Save, Settings } from 'lucide-react';
import { fetchAdminSettings, updateAdminSetting, type Setting } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { toast } from 'sonner';

const ADMIN_TOKEN_KEY = 'bellat_admin_token';

// Group settings by their key prefix (before the first dot)
function groupSettings(settings: Setting[]): Record<string, Setting[]> {
  return settings.reduce<Record<string, Setting[]>>((acc, s) => {
    const group = s.key.split('.')[0];
    if (!acc[group]) acc[group] = [];
    acc[group].push(s);
    return acc;
  }, {});
}

const GROUP_LABELS: Record<string, string> = {
  app: 'Informations de l\'application',
  features: 'Fonctionnalités',
};

// Settings whose value is "true" or "false" are rendered as a toggle
function isBooleanSetting(value: string) {
  return value === 'true' || value === 'false';
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;
    fetchAdminSettings(token).then((data) => {
      setSettings(data);
      // Initialise edits with current values
      const initial: Record<string, string> = {};
      data.forEach((s) => { initial[s.key] = s.value; });
      setEdits(initial);
      setIsLoading(false);
    });
  }, []);

  const handleSave = async (key: string) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;
    setSaving((p) => ({ ...p, [key]: true }));
    try {
      const updated = await updateAdminSetting(token, key, edits[key]);
      setSettings((prev) => prev.map((s) => (s.key === key ? updated : s)));
      toast.success('Paramètre mis à jour');
    } catch (err) {
      toast.error((err as Error).message ?? 'Erreur de sauvegarde');
    } finally {
      setSaving((p) => ({ ...p, [key]: false }));
    }
  };

  const handleToggle = async (key: string, current: string) => {
    const newVal = current === 'true' ? 'false' : 'true';
    setEdits((p) => ({ ...p, [key]: newVal }));
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;
    setSaving((p) => ({ ...p, [key]: true }));
    try {
      const updated = await updateAdminSetting(token, key, newVal);
      setSettings((prev) => prev.map((s) => (s.key === key ? updated : s)));
      toast.success('Paramètre mis à jour');
    } catch (err) {
      toast.error((err as Error).message ?? 'Erreur');
      // Revert on error
      setEdits((p) => ({ ...p, [key]: current }));
    } finally {
      setSaving((p) => ({ ...p, [key]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-gray-200 rounded-xl animate-pulse" />)}
      </div>
    );
  }

  const grouped = groupSettings(settings);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Settings className="h-7 w-7 text-green-600" />
        <h1 className="text-3xl font-bold">Paramètres</h1>
      </div>

      {Object.entries(grouped).map(([group, groupSettings]) => (
        <Card key={group}>
          <CardHeader>
            <CardTitle className="text-base text-gray-700">
              {GROUP_LABELS[group] ?? group}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {groupSettings.map((setting) => (
              <div key={setting.key}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-medium text-gray-800 mb-0.5">
                      {setting.label}
                    </label>
                    {setting.description && (
                      <p className="text-xs text-gray-400 mb-2">{setting.description}</p>
                    )}
                    {isBooleanSetting(edits[setting.key] ?? setting.value) ? (
                      /* Boolean toggle */
                      <button
                        type="button"
                        onClick={() => handleToggle(setting.key, edits[setting.key] ?? setting.value)}
                        disabled={saving[setting.key]}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          (edits[setting.key] ?? setting.value) === 'true'
                            ? 'bg-green-600'
                            : 'bg-gray-300'
                        } disabled:opacity-50`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                            (edits[setting.key] ?? setting.value) === 'true'
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    ) : (
                      /* Text input with save button */
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={edits[setting.key] ?? setting.value}
                          onChange={(e) =>
                            setEdits((p) => ({ ...p, [setting.key]: e.target.value }))
                          }
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => handleSave(setting.key)}
                          disabled={
                            saving[setting.key] ||
                            edits[setting.key] === setting.value
                          }
                          className="flex items-center gap-1.5 px-3 py-2 bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <Save className="h-3.5 w-3.5" />
                          {saving[setting.key] ? 'Enregistrement…' : 'Sauvegarder'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {settings.length === 0 && (
        <p className="text-gray-500 text-sm">
          Aucun paramètre trouvé. Assurez-vous que la migration <code>20260321210000_add_settings</code> a été appliquée.
        </p>
      )}
    </div>
  );
}

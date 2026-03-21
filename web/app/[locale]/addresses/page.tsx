"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { toast } from 'sonner';
import { MapPin, Star, Trash2, Plus, X, Pencil } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type Address,
} from '@/lib/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// 48 Algerian wilayas (abbreviated list — full list would have all 48)
const WILAYAS = [
  'Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar',
  'Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger',
  'Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma',
  'Constantine','Médéa','Mostaganem','M\'Sila','Mascara','Ouargla','Oran','El Bayadh',
  'Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt',
  'El Oued','Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma',
  'Aïn Témouchent','Ghardaïa','Relizane',
];

const EMPTY_FORM = { fullName: '', phoneNumber: '+213', addressLine1: '', wilaya: '', commune: '', isDefault: false };

export default function AddressesPage() {
  const router = useRouter();
  const locale = useLocale();
  const { token, isAuthenticated } = useAuth();
  const ar = locale === 'ar';

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const openEdit = (addr: Address) => {
    setEditingId(addr.id);
    setForm({ fullName: addr.fullName, phoneNumber: addr.phoneNumber, addressLine1: addr.addressLine1, wilaya: addr.wilaya, commune: addr.commune, isDefault: addr.isDefault });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  useEffect(() => {
    if (!isAuthenticated) { router.replace(`/${locale}/login`); return; }
    fetchAddresses(token!).then(setAddresses).finally(() => setIsLoading(false));
  }, [isAuthenticated, token, locale, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        const updated = await updateAddress(token!, editingId, form);
        setAddresses((prev) => {
          const list = form.isDefault ? prev.map((a) => ({ ...a, isDefault: false })) : prev;
          return list.map((a) => a.id === editingId ? { ...updated } : a);
        });
        toast.success(ar ? 'تم تحديث العنوان' : 'Adresse mise à jour');
      } else {
        const newAddr = await createAddress(token!, form);
        setAddresses((prev) => {
          const list = form.isDefault ? prev.map((a) => ({ ...a, isDefault: false })) : prev;
          return [newAddr, ...list];
        });
        toast.success(ar ? 'تمت إضافة العنوان' : 'Adresse ajoutée');
      }
      closeForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    setDeleting(addressId);
    try {
      await deleteAddress(token!, addressId);
      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
      toast.success(ar ? 'تم حذف العنوان' : 'Adresse supprimée');
    } catch {
      toast.error('Erreur');
    } finally {
      setDeleting(null);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await setDefaultAddress(token!, addressId);
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === addressId }))
      );
    } catch {
      toast.error('Erreur');
    }
  };

  const field = (label: string, labelAr: string, children: React.ReactNode) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{ar ? labelAr : label}</label>
      {children}
    </div>
  );

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{ar ? 'عناويني' : 'Mes adresses'}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {ar ? `${addresses.length} / 10 عناوين` : `${addresses.length} / 10 adresses`}
          </p>
        </div>
        {!showForm && addresses.length < 10 && (
          <Button onClick={() => { setEditingId(null); setForm(EMPTY_FORM); setShowForm(true); }} className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            {ar ? 'إضافة' : 'Ajouter'}
          </Button>
        )}
      </header>

      {/* Add form */}
      {showForm && (
        <Card className="mb-4 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">
                {editingId
                  ? ar ? 'تعديل العنوان' : "Modifier l'adresse"
                  : ar ? 'عنوان جديد' : 'Nouvelle adresse'}
              </h2>
              <button onClick={closeForm}>
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              {field('Nom complet', 'الاسم الكامل',
                <input type="text" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputCls} placeholder="Amine Benali" />
              )}
              {field('Téléphone', 'الهاتف',
                <input type="tel" required value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} className={inputCls} placeholder="+213555123456" />
              )}
              {field('Adresse', 'العنوان',
                <input type="text" required value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} className={inputCls} placeholder="12 Rue Didouche Mourad" />
              )}
              {field('Wilaya', 'الولاية',
                <select required value={form.wilaya} onChange={(e) => setForm({ ...form, wilaya: e.target.value })} className={inputCls}>
                  <option value="">{ar ? 'اختر الولاية' : 'Choisir une wilaya'}</option>
                  {WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
                </select>
              )}
              {field('Commune', 'البلدية',
                <input type="text" required value={form.commune} onChange={(e) => setForm({ ...form, commune: e.target.value })} className={inputCls} placeholder="Sétif" />
              )}
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="rounded" />
                {ar ? 'عنوان افتراضي' : 'Définir comme adresse par défaut'}
              </label>
              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? '...' : editingId
                  ? ar ? 'حفظ التعديلات' : 'Enregistrer les modifications'
                  : ar ? 'حفظ العنوان' : "Enregistrer l'adresse"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Address list */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />)}
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <MapPin className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>{ar ? 'لا توجد عناوين محفوظة' : 'Aucune adresse enregistrée'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <Card key={addr.id} className={addr.isDefault ? 'border-green-300' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 text-sm">{addr.fullName}</p>
                        {addr.isDefault && (
                          <span className="inline-flex items-center gap-0.5 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                            <Star className="h-3 w-3" />
                            {ar ? 'افتراضي' : 'Par défaut'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{addr.addressLine1}</p>
                      <p className="text-sm text-gray-500">{addr.commune}, {addr.wilaya}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{addr.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-xs text-gray-500 hover:text-green-700 hover:underline"
                      >
                        {ar ? 'افتراضي' : 'Par défaut'}
                      </button>
                    )}
                    <button
                      onClick={() => openEdit(addr)}
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                      aria-label="Modifier"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      disabled={deleting === addr.id}
                      className="text-gray-400 hover:text-red-500 disabled:opacity-40 transition-colors"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

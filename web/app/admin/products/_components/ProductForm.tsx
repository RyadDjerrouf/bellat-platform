
"use client";

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { fetchCategories, adminCreateProduct, adminUpdateProduct, uploadProductImage, type AdminProductPayload } from '@/lib/api';
import type { Category } from '@/types/category';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

const ADMIN_TOKEN_KEY = 'bellat_admin_token';

const STOCK_STATUSES = [
  { value: 'in_stock',     label: 'En stock' },
  { value: 'low_stock',    label: 'Stock faible' },
  { value: 'out_of_stock', label: 'Rupture de stock' },
];

interface ProductFormProps {
  /** When provided, the form is in edit mode and pre-fills fields. */
  productId?: string;
  initial?: Partial<AdminProductPayload>;
}

export function ProductForm({ productId, initial }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!productId;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [id, setId]                     = useState(productId ?? '');
  const [nameFr, setNameFr]             = useState(initial?.nameFr ?? '');
  const [nameAr, setNameAr]             = useState(initial?.nameAr ?? '');
  const [descriptionFr, setDescFr]      = useState(initial?.descriptionFr ?? '');
  const [descriptionAr, setDescAr]      = useState(initial?.descriptionAr ?? '');
  const [categoryId, setCategoryId]     = useState(initial?.categoryId ?? '');
  const [imageUrl, setImageUrl]         = useState(initial?.imageUrl ?? '');
  const [price, setPrice]               = useState(String(initial?.price ?? ''));
  const [unit, setUnit]                 = useState(initial?.unit ?? '');
  const [stockStatus, setStockStatus]   = useState(initial?.stockStatus ?? 'in_stock');

  const [categories, setCategories]     = useState<Category[]>([]);
  const [submitting, setSubmitting]     = useState(false);
  const [uploading, setUploading]       = useState(false);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;
    setUploading(true);
    try {
      const url = await uploadProductImage(token, file);
      setImageUrl(url);
      toast.success('Image uploadée');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Échec upload');
    } finally {
      setUploading(false);
      // Reset input so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;

    const payload: AdminProductPayload = {
      nameFr, nameAr,
      descriptionFr: descriptionFr || undefined,
      descriptionAr: descriptionAr || undefined,
      categoryId: categoryId || undefined,
      imageUrl: imageUrl || undefined,
      price: Number(price),
      unit: unit || undefined,
      stockStatus,
    };

    setSubmitting(true);
    try {
      if (isEdit) {
        await adminUpdateProduct(token, productId, payload);
        toast.success('Produit mis à jour');
      } else {
        await adminCreateProduct(token, { ...payload, id });
        toast.success('Produit créé');
      }
      router.push('/admin/products');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </button>

      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? 'Modifier le produit' : 'Nouveau produit'}
      </h1>

      <form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <CardHeader><CardTitle className="text-sm text-gray-600">Identifiant &amp; noms</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="id">ID produit</Label>
              <Input
                id="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="prod_011"
                disabled={isEdit}
                required={!isEdit}
                className={isEdit ? 'bg-gray-50 text-gray-500' : ''}
              />
              {!isEdit && <p className="text-xs text-gray-400">Identifiant unique, ne peut pas être modifié après création.</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="nameFr">Nom (FR)</Label>
                <Input id="nameFr" value={nameFr} onChange={(e) => setNameFr(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nameAr">الاسم (AR)</Label>
                <Input id="nameAr" value={nameAr} onChange={(e) => setNameAr(e.target.value)} dir="rtl" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="descFr">Description (FR)</Label>
                <textarea
                  id="descFr"
                  value={descriptionFr}
                  onChange={(e) => setDescFr(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="descAr">الوصف (AR)</Label>
                <textarea
                  id="descAr"
                  value={descriptionAr}
                  onChange={(e) => setDescAr(e.target.value)}
                  rows={3}
                  dir="rtl"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader><CardTitle className="text-sm text-gray-600">Prix, catégorie &amp; stock</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="price">Prix (DZD)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="unit">Unité</Label>
                <Input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="500g, kg, pièce…" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="categoryId">Catégorie</Label>
                <select
                  id="categoryId"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                >
                  <option value="">— Aucune —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name_fr}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stockStatus">Statut stock</Label>
                <select
                  id="stockStatus"
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                >
                  {STOCK_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image upload */}
            <div className="space-y-2">
              <Label>Image produit</Label>
              <div className="flex gap-3 items-start">
                {/* Preview */}
                {imageUrl && (
                  <div className="relative w-20 h-20 rounded-lg border border-gray-200 overflow-hidden shrink-0">
                    <Image
                      src={imageUrl}
                      alt="Aperçu"
                      fill
                      className="object-cover"
                      unoptimized={imageUrl.startsWith('http://localhost')}
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-0.5 right-0.5 bg-black/50 rounded-full p-0.5 text-white hover:bg-black/70"
                      aria-label="Supprimer l'image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  {/* File picker */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full flex items-center gap-2 justify-center"
                  >
                    <Upload className="h-4 w-4" />
                    {uploading ? 'Upload en cours…' : 'Choisir un fichier'}
                  </Button>
                  {/* Manual URL fallback */}
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="ou coller une URL…"
                    className="text-xs"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400">JPEG, PNG ou WebP · max 5 Mo</p>
            </div>
          </CardContent>
        </Card>

        <CardFooter className="px-0 pb-0">
          <Button type="submit" disabled={submitting || uploading} className="w-full">
            {submitting ? '...' : isEdit ? 'Enregistrer les modifications' : 'Créer le produit'}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}

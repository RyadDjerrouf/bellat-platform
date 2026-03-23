"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import {
  adminCreateRecipe, adminUpdateRecipe,
  type AdminRecipePayload, type RecipeApi,
} from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

const ADMIN_TOKEN_KEY = 'bellat_admin_token';

const CATEGORIES = [
  { value: 'starter', label: 'Entrée' },
  { value: 'main',    label: 'Plat principal' },
  { value: 'quick',   label: 'Rapide' },
  { value: 'bbq',     label: 'BBQ' },
];

const DIFFICULTIES = [
  { value: 'easy',   label: 'Facile' },
  { value: 'medium', label: 'Moyen' },
  { value: 'hard',   label: 'Difficile' },
];

interface IngredientRow {
  productId: string;
  nameFr: string;
  nameAr: string;
  quantity: string;
  unit: string;
}

interface RecipeFormProps {
  recipeId?: string;
  initial?: RecipeApi;
}

export function RecipeForm({ recipeId, initial }: RecipeFormProps) {
  const router = useRouter();
  const isEdit = !!recipeId;

  const [id, setId]               = useState(recipeId ?? '');
  const [nameFr, setNameFr]       = useState(initial?.nameFr ?? '');
  const [nameAr, setNameAr]       = useState(initial?.nameAr ?? '');
  const [descFr, setDescFr]       = useState(initial?.descriptionFr ?? '');
  const [descAr, setDescAr]       = useState(initial?.descriptionAr ?? '');
  const [category, setCategory]   = useState(initial?.category ?? 'quick');
  const [imageUrl, setImageUrl]   = useState(initial?.imageUrl ?? '');
  const [prepTime, setPrepTime]   = useState(String(initial?.prepTime ?? 0));
  const [cookTime, setCookTime]   = useState(String(initial?.cookTime ?? 0));
  const [servings, setServings]   = useState(String(initial?.servings ?? 4));
  const [difficulty, setDifficulty] = useState(initial?.difficulty ?? 'easy');
  const [stepsFr, setStepsFr]     = useState<string[]>(initial?.stepsFr ?? ['']);
  const [stepsAr, setStepsAr]     = useState<string[]>(initial?.stepsAr ?? ['']);
  const [ingredients, setIngredients] = useState<IngredientRow[]>(
    initial?.ingredients.map((i) => ({
      productId: i.productId ?? '',
      nameFr: i.nameFr,
      nameAr: i.nameAr,
      quantity: i.quantity,
      unit: i.unit,
    })) ?? [{ productId: '', nameFr: '', nameAr: '', quantity: '', unit: '' }],
  );
  const [submitting, setSubmitting] = useState(false);

  const addStep = (lang: 'fr' | 'ar') => {
    if (lang === 'fr') setStepsFr((s) => [...s, '']);
    else setStepsAr((s) => [...s, '']);
  };

  const updateStep = (lang: 'fr' | 'ar', i: number, val: string) => {
    if (lang === 'fr') setStepsFr((s) => s.map((v, idx) => (idx === i ? val : v)));
    else setStepsAr((s) => s.map((v, idx) => (idx === i ? val : v)));
  };

  const removeStep = (lang: 'fr' | 'ar', i: number) => {
    if (lang === 'fr') setStepsFr((s) => s.filter((_, idx) => idx !== i));
    else setStepsAr((s) => s.filter((_, idx) => idx !== i));
  };

  const addIngredient = () =>
    setIngredients((prev) => [...prev, { productId: '', nameFr: '', nameAr: '', quantity: '', unit: '' }]);

  const removeIngredient = (i: number) =>
    setIngredients((prev) => prev.filter((_, idx) => idx !== i));

  const updateIngredient = (i: number, field: keyof IngredientRow, val: string) =>
    setIngredients((prev) => prev.map((row, idx) => (idx === i ? { ...row, [field]: val } : row)));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;

    const payload: AdminRecipePayload = {
      nameFr, nameAr,
      descriptionFr: descFr || undefined,
      descriptionAr: descAr || undefined,
      category,
      imageUrl: imageUrl || undefined,
      prepTime: Number(prepTime),
      cookTime: Number(cookTime),
      servings: Number(servings),
      difficulty,
      stepsFr: stepsFr.filter(Boolean),
      stepsAr: stepsAr.filter(Boolean),
      ingredients: ingredients
        .filter((i) => i.nameFr || i.nameAr)
        .map((i, idx) => ({
          productId: i.productId || undefined,
          nameFr: i.nameFr,
          nameAr: i.nameAr,
          quantity: i.quantity,
          unit: i.unit,
          sortOrder: idx,
        })),
    };

    setSubmitting(true);
    try {
      if (isEdit) {
        await adminUpdateRecipe(token, recipeId, payload);
        toast.success('Recette mise à jour');
      } else {
        await adminCreateRecipe(token, { ...payload, id });
        toast.success('Recette créée');
      }
      router.push('/admin/recipes');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </button>

      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? 'Modifier la recette' : 'Nouvelle recette'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Identité */}
        <Card>
          <CardHeader><CardTitle className="text-sm text-gray-600">Identité</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {!isEdit && (
              <div className="space-y-1.5">
                <Label htmlFor="id">ID (slug)</Label>
                <Input id="id" value={id} onChange={(e) => setId(e.target.value)} placeholder="chawarma-maison" required />
                <p className="text-xs text-gray-400">Identifiant unique, non modifiable après création.</p>
              </div>
            )}
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
                  id="descFr" value={descFr} onChange={(e) => setDescFr(e.target.value)} rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="descAr">الوصف (AR)</Label>
                <textarea
                  id="descAr" value={descAr} onChange={(e) => setDescAr(e.target.value)} rows={3} dir="rtl"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Infos */}
        <Card>
          <CardHeader><CardTitle className="text-sm text-gray-600">Catégorie &amp; difficulté</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="category">Catégorie</Label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="difficulty">Difficulté</Label>
                <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                  {DIFFICULTIES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="prepTime">Préparation (min)</Label>
                <Input id="prepTime" type="number" min="0" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cookTime">Cuisson (min)</Label>
                <Input id="cookTime" type="number" min="0" value={cookTime} onChange={(e) => setCookTime(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="servings">Personnes</Label>
                <Input id="servings" type="number" min="1" value={servings} onChange={(e) => setServings(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="imageUrl">URL image</Label>
              <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="/images/recipes/..." />
            </div>
          </CardContent>
        </Card>

        {/* Ingredients */}
        <Card>
          <CardHeader><CardTitle className="text-sm text-gray-600">Ingrédients</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {ingredients.map((ing, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-3 space-y-1">
                  <Input placeholder="Nom FR" value={ing.nameFr} onChange={(e) => updateIngredient(i, 'nameFr', e.target.value)} />
                </div>
                <div className="col-span-3 space-y-1">
                  <Input placeholder="الاسم" value={ing.nameAr} onChange={(e) => updateIngredient(i, 'nameAr', e.target.value)} dir="rtl" />
                </div>
                <div className="col-span-2">
                  <Input placeholder="Qté" value={ing.quantity} onChange={(e) => updateIngredient(i, 'quantity', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <Input placeholder="Unité" value={ing.unit} onChange={(e) => updateIngredient(i, 'unit', e.target.value)} />
                </div>
                <div className="col-span-1">
                  <Input placeholder="prod_" value={ing.productId} onChange={(e) => updateIngredient(i, 'productId', e.target.value)} title="ID produit Bellat (optionnel)" />
                </div>
                <div className="col-span-1 pt-0.5">
                  <button type="button" onClick={() => removeIngredient(i)} className="text-red-400 hover:text-red-600 p-1.5">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            <p className="text-xs text-gray-400">Colonnes : Nom FR · Nom AR · Quantité · Unité · ID produit Bellat</p>
            <Button type="button" variant="secondary" onClick={addIngredient} className="flex items-center gap-1.5 text-sm">
              <Plus className="h-4 w-4" /> Ajouter un ingrédient
            </Button>
          </CardContent>
        </Card>

        {/* Steps */}
        <Card>
          <CardHeader><CardTitle className="text-sm text-gray-600">Étapes de préparation</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            {/* French steps */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Français</p>
              <div className="space-y-2">
                {stepsFr.map((step, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center mt-1.5">{i + 1}</span>
                    <textarea
                      value={step}
                      onChange={(e) => updateStep('fr', i, e.target.value)}
                      rows={2}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      placeholder={`Étape ${i + 1}`}
                    />
                    <button type="button" onClick={() => removeStep('fr', i)} className="text-red-400 hover:text-red-600 p-1.5 mt-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <Button type="button" variant="secondary" onClick={() => addStep('fr')} className="flex items-center gap-1.5 text-sm">
                  <Plus className="h-4 w-4" /> Ajouter une étape
                </Button>
              </div>
            </div>

            {/* Arabic steps */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">العربية</p>
              <div className="space-y-2">
                {stepsAr.map((step, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center mt-1.5">{i + 1}</span>
                    <textarea
                      value={step}
                      onChange={(e) => updateStep('ar', i, e.target.value)}
                      rows={2}
                      dir="rtl"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      placeholder={`الخطوة ${i + 1}`}
                    />
                    <button type="button" onClick={() => removeStep('ar', i)} className="text-red-400 hover:text-red-600 p-1.5 mt-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <Button type="button" variant="secondary" onClick={() => addStep('ar')} className="flex items-center gap-1.5 text-sm">
                  <Plus className="h-4 w-4" /> إضافة خطوة
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <CardFooter className="px-0 pb-0">
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? '...' : isEdit ? 'Enregistrer les modifications' : 'Créer la recette'}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { RecipeForm } from '../../_components/RecipeForm';
import type { RecipeApi } from '@/lib/api';

const ADMIN_TOKEN_KEY = 'bellat_admin_token';

export default function EditRecipePage() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeApi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token || !id) return;
    const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002';
    fetch(`${API_BASE}/api/admin/recipes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setRecipe)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    );
  }

  if (!recipe) return <p className="text-gray-500">Recette introuvable.</p>;

  return <RecipeForm recipeId={id} initial={recipe} />;
}

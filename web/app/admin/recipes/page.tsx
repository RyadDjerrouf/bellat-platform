"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ChefHat, Plus, Pencil, EyeOff, Eye, Clock, Users } from 'lucide-react';
import { fetchAdminRecipes, adminDeleteRecipe, adminUpdateRecipe, type RecipeApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';

const ADMIN_TOKEN_KEY = 'bellat_admin_token';

const CATEGORY_LABELS: Record<string, string> = {
  starter: 'Entrée',
  main:    'Plat principal',
  quick:   'Rapide',
  bbq:     'BBQ',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy:   'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard:   'bg-red-100 text-red-700',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Facile', medium: 'Moyen', hard: 'Difficile',
};

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<RecipeApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;
    fetchAdminRecipes(token)
      .then(setRecipes)
      .finally(() => setLoading(false));
  }, []);

  const handleToggleActive = async (recipe: RecipeApi) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;
    setToggling(recipe.id);
    try {
      const updated = await adminUpdateRecipe(token, recipe.id, { isActive: !recipe.isActive });
      setRecipes((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      toast.success(updated.isActive ? 'Recette activée' : 'Recette désactivée');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setToggling(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recettes</h1>
          <p className="text-sm text-gray-500 mt-1">{recipes.length} recette(s)</p>
        </div>
        <Link href="/admin/recipes/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle recette
          </Button>
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <ChefHat className="h-12 w-12 mx-auto mb-3 text-gray-200" />
          <p>Aucune recette. Créez-en une !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden ${!recipe.isActive ? 'opacity-60' : ''}`}
            >
              {/* Card header */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 h-32 flex items-center justify-center relative">
                <ChefHat className="h-12 w-12 text-green-200" />
                <span className={`absolute top-2 start-2 text-xs font-medium px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[recipe.difficulty] ?? 'bg-gray-100 text-gray-600'}`}>
                  {DIFFICULTY_LABELS[recipe.difficulty] ?? recipe.difficulty}
                </span>
                {!recipe.isActive && (
                  <span className="absolute top-2 end-2 bg-gray-700/80 text-white text-xs px-2 py-0.5 rounded-full">
                    Masquée
                  </span>
                )}
              </div>

              <div className="p-4">
                <p className="text-xs text-gray-400 mb-1">{CATEGORY_LABELS[recipe.category] ?? recipe.category}</p>
                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{recipe.nameFr}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {recipe.prepTime + recipe.cookTime} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {recipe.servings} pers.
                  </span>
                  <span>{recipe.ingredients.filter((i) => i.productId).length} produit(s) Bellat</span>
                </div>

                <div className="flex gap-2">
                  <Link href={`/admin/recipes/${recipe.id}/edit`} className="flex-1">
                    <Button variant="secondary" className="w-full flex items-center gap-1.5 justify-center text-xs py-1.5">
                      <Pencil className="h-3.5 w-3.5" />
                      Modifier
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    onClick={() => handleToggleActive(recipe)}
                    disabled={toggling === recipe.id}
                    className="flex items-center gap-1.5 text-xs py-1.5 px-3"
                    title={recipe.isActive ? 'Masquer' : 'Afficher'}
                  >
                    {recipe.isActive ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

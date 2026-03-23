import Link from 'next/link';
import { Clock, ChefHat } from 'lucide-react';
import { fetchRecipes } from '@/lib/api';

type Props = { params: Promise<{ locale: string }> };

const CATEGORIES = ['starter', 'main', 'quick', 'bbq'] as const;

const CATEGORY_LABELS: Record<string, { fr: string; ar: string }> = {
  starter: { fr: 'Entrée', ar: 'مقبلات' },
  main:    { fr: 'Plat principal', ar: 'طبق رئيسي' },
  quick:   { fr: 'Rapide', ar: 'سريع' },
  bbq:     { fr: 'BBQ', ar: 'شواء' },
};

const DIFFICULTY_LABELS: Record<string, { fr: string; ar: string }> = {
  easy:   { fr: 'Facile', ar: 'سهل' },
  medium: { fr: 'Moyen', ar: 'متوسط' },
  hard:   { fr: 'Difficile', ar: 'صعب' },
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy:   'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard:   'bg-red-100 text-red-700',
};

export default async function RecipesPage({ params }: Props) {
  const { locale } = await params;
  const ar = locale === 'ar';

  const recipes = await fetchRecipes();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {ar ? 'وصفات بيلات' : 'Recettes Bellat'}
        </h1>
        <p className="text-gray-500">
          {ar
            ? 'اكتشف وصفات شهية تستخدم منتجاتنا الحلال عالية الجودة.'
            : 'Découvrez des recettes savoureuses à base de nos produits halal de qualité.'}
        </p>
      </div>

      {/* Category sections */}
      {CATEGORIES.map((cat) => {
        const catRecipes = recipes.filter((r) => r.category === cat);
        if (catRecipes.length === 0) return null;
        const label = CATEGORY_LABELS[cat] ?? { fr: cat, ar: cat };
        return (
          <section key={cat} className="mb-12">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-green-700 rounded-full inline-block" />
              {ar ? label.ar : label.fr}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {catRecipes.map((recipe) => {
                const diffLabel = DIFFICULTY_LABELS[recipe.difficulty] ?? { fr: recipe.difficulty, ar: recipe.difficulty };
                const diffColor = DIFFICULTY_COLORS[recipe.difficulty] ?? 'bg-gray-100 text-gray-600';
                const bellatCount = recipe.ingredients.filter((i) => i.productId).length;
                return (
                  <Link
                    key={recipe.id}
                    href={`/${locale}/recipes/${recipe.id}`}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Image */}
                    <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                      <ChefHat className="h-16 w-16 text-green-200" />
                      <span className={`absolute top-3 start-3 text-xs font-medium px-2 py-0.5 rounded-full ${diffColor}`}>
                        {ar ? diffLabel.ar : diffLabel.fr}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2">
                        {ar ? recipe.nameAr : recipe.nameFr}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {ar ? recipe.descriptionAr : recipe.descriptionFr}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {recipe.prepTime + recipe.cookTime} {ar ? 'دقيقة' : 'min'}
                        </span>
                        <span>
                          {recipe.servings} {ar ? 'حصص' : 'pers.'}
                        </span>
                        <span>
                          {bellatCount}{' '}
                          {ar ? 'منتج بيلات' : 'produit(s) Bellat'}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {recipes.length === 0 && (
        <p className="text-center text-gray-400 py-16">
          {ar ? 'لا توجد وصفات بعد.' : 'Aucune recette pour le moment.'}
        </p>
      )}
    </div>
  );
}

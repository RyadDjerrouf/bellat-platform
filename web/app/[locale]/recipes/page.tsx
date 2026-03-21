import Link from 'next/link';
import { Clock, ChefHat } from 'lucide-react';
import {
  RECIPES, CATEGORY_LABELS, DIFFICULTY_LABELS,
  type RecipeCategory,
} from '@/lib/data/recipes';

type Props = { params: Promise<{ locale: string }> };

const CATEGORIES: RecipeCategory[] = ['starter', 'main', 'quick', 'bbq'];

const DIFFICULTY_COLORS = {
  easy:   'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard:   'bg-red-100 text-red-700',
};

export default async function RecipesPage({ params }: Props) {
  const { locale } = await params;
  const ar = locale === 'ar';

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
        const recipes = RECIPES.filter((r) => r.category === cat);
        if (recipes.length === 0) return null;
        return (
          <section key={cat} className="mb-12">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-green-700 rounded-full inline-block" />
              {ar ? CATEGORY_LABELS[cat].ar : CATEGORY_LABELS[cat].fr}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`/${locale}/recipes/${recipe.id}`}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Image placeholder */}
                  <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                    <ChefHat className="h-16 w-16 text-green-200" />
                    {/* Difficulty badge */}
                    <span className={`absolute top-3 start-3 text-xs font-medium px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[recipe.difficulty]}`}>
                      {ar ? DIFFICULTY_LABELS[recipe.difficulty].ar : DIFFICULTY_LABELS[recipe.difficulty].fr}
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
                        {recipe.ingredients.filter((i) => i.bellatProductId).length}{' '}
                        {ar ? 'منتج بيلات' : 'produit(s) Bellat'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, Users, ChefHat, ArrowLeft, ShoppingCart } from 'lucide-react';
import { fetchRecipeById } from '@/lib/api';
import { AddBellatIngredientsButton } from '@/components/recipes/AddBellatIngredientsButton';

type Props = { params: Promise<{ locale: string; id: string }> };

const DIFFICULTY_LABELS: Record<string, { fr: string; ar: string }> = {
  easy:   { fr: 'Facile', ar: 'سهل' },
  medium: { fr: 'Moyen', ar: 'متوسط' },
  hard:   { fr: 'Difficile', ar: 'صعب' },
};

const CATEGORY_LABELS: Record<string, { fr: string; ar: string }> = {
  starter: { fr: 'Entrée', ar: 'مقبلات' },
  main:    { fr: 'Plat principal', ar: 'طبق رئيسي' },
  quick:   { fr: 'Rapide', ar: 'سريع' },
  bbq:     { fr: 'BBQ', ar: 'شواء' },
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy:   'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard:   'bg-red-100 text-red-700',
};

export default async function RecipeDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const recipe = await fetchRecipeById(id);
  if (!recipe) notFound();

  const ar = locale === 'ar';
  const bellatIngredients = recipe.ingredients.filter((i) => i.productId);
  const diffLabel = DIFFICULTY_LABELS[recipe.difficulty] ?? { fr: recipe.difficulty, ar: recipe.difficulty };
  const catLabel = CATEGORY_LABELS[recipe.category] ?? { fr: recipe.category, ar: recipe.category };
  const diffColor = DIFFICULTY_COLORS[recipe.difficulty] ?? 'bg-gray-100 text-gray-600';

  const steps = ar ? recipe.stepsAr : recipe.stepsFr;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href={`/${locale}/recipes`}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {ar ? 'كل الوصفات' : 'Toutes les recettes'}
      </Link>

      {/* Hero */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl flex items-center justify-center aspect-video mb-8">
        <ChefHat className="h-24 w-24 text-green-200" />
      </div>

      {/* Title + meta */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${diffColor}`}>
            {ar ? diffLabel.ar : diffLabel.fr}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
            {ar ? catLabel.ar : catLabel.fr}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {ar ? recipe.nameAr : recipe.nameFr}
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          {ar ? recipe.descriptionAr : recipe.descriptionFr}
        </p>
        <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-green-600" />
            {ar ? 'التحضير' : 'Prép.'} {recipe.prepTime} {ar ? 'دق' : 'min'}
          </span>
          {recipe.cookTime > 0 && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-orange-500" />
              {ar ? 'الطهي' : 'Cuisson'} {recipe.cookTime} {ar ? 'دق' : 'min'}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-blue-500" />
            {recipe.servings} {ar ? 'حصص' : 'personnes'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Ingredients */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">
            {ar ? 'المكونات' : 'Ingrédients'}
          </h2>
          <ul className="space-y-2 mb-6">
            {recipe.ingredients.map((ing) => (
              <li
                key={ing.id}
                className={`flex items-start gap-2 text-sm py-2 border-b border-gray-50 ${ing.productId ? 'font-medium text-gray-900' : 'text-gray-600'}`}
              >
                <span className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${ing.productId ? 'bg-green-500' : 'bg-gray-200'}`} />
                <span>
                  <span className="text-gray-400 me-1">{ing.quantity} {ing.unit}</span>
                  {ar ? ing.nameAr : ing.nameFr}
                </span>
              </li>
            ))}
          </ul>

          {/* Add Bellat products to cart */}
          {bellatIngredients.length > 0 && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <p className="text-sm font-medium text-green-800 mb-1 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                {ar ? 'منتجات بيلات في هذه الوصفة' : 'Produits Bellat dans cette recette'}
              </p>
              <p className="text-xs text-green-600 mb-3">
                {ar
                  ? `${bellatIngredients.length} منتج — أضفها كلها للسلة بنقرة واحدة`
                  : `${bellatIngredients.length} produit(s) — ajoutez-les tous en un clic`}
              </p>
              <AddBellatIngredientsButton
                ingredients={bellatIngredients}
                locale={locale}
              />
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">
            {ar ? 'طريقة التحضير' : 'Préparation'}
          </h2>
          <ol className="space-y-5">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-green-700 text-white text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

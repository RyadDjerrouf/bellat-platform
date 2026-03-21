"use client";

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { fetchProductById } from '@/lib/api';
import { toast } from 'sonner';
import type { RecipeIngredient } from '@/lib/data/recipes';

interface Props {
  ingredients: RecipeIngredient[];
  locale: string;
}

export function AddBellatIngredientsButton({ ingredients, locale }: Props) {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const ar = locale === 'ar';

  const handleAddAll = async () => {
    setIsLoading(true);
    let added = 0;
    for (const ing of ingredients) {
      if (!ing.bellatProductId) continue;
      const product = await fetchProductById(ing.bellatProductId);
      if (product) {
        addToCart(product, 1);
        added++;
      }
    }
    setIsLoading(false);
    if (added > 0) {
      setDone(true);
      toast.success(
        ar
          ? `تمت إضافة ${added} منتج إلى السلة`
          : `${added} produit(s) Bellat ajouté(s) au panier`,
      );
      setTimeout(() => setDone(false), 3000);
    }
  };

  return (
    <button
      onClick={handleAddAll}
      disabled={isLoading || done}
      className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 ${
        done
          ? 'bg-green-600 text-white'
          : 'bg-green-700 text-white hover:bg-green-800'
      }`}
    >
      {done ? (
        <>
          <Check className="h-4 w-4" />
          {ar ? 'تمت الإضافة!' : 'Ajouté !'}
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          {isLoading
            ? (ar ? 'جارٍ الإضافة...' : 'Ajout en cours...')
            : (ar ? 'إضافة كل المنتجات' : 'Tout ajouter au panier')}
        </>
      )}
    </button>
  );
}

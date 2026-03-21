"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchFavorites, removeFavorite, type FavoriteProduct } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/Card';
import { toast } from 'sonner';

export default function FavoritesPage() {
  const { locale } = useParams<{ locale: string }>();
  const { token, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  const isFr = locale !== 'ar';
  const t = {
    title:   isFr ? 'Mes favoris' : 'المفضلة',
    empty:   isFr ? 'Aucun favori pour le moment.' : 'لا توجد منتجات مفضلة.',
    browse:  isFr ? 'Parcourir les produits' : 'تصفح المنتجات',
    remove:  isFr ? 'Retirer' : 'إزالة',
    cart:    isFr ? 'Ajouter au panier' : 'أضف للسلة',
    login:   isFr ? 'Connectez-vous pour voir vos favoris.' : 'سجّل دخولك لرؤية مفضلتك.',
  };

  useEffect(() => {
    if (!token) { setIsLoading(false); return; }
    fetchFavorites(token).then((data) => {
      setFavorites(data);
      setIsLoading(false);
    });
  }, [token]);

  const handleRemove = async (productId: string) => {
    if (!token) return;
    setRemoving(productId);
    try {
      await removeFavorite(token, productId);
      setFavorites((prev) => prev.filter((p) => p.id !== productId));
      toast.success(isFr ? 'Retiré des favoris' : 'تمت الإزالة');
    } catch {
      toast.error(isFr ? 'Erreur' : 'خطأ');
    } finally {
      setRemoving(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <Heart className="h-12 w-12 text-gray-300" />
        <p className="text-gray-500">{t.login}</p>
        <Link href={`/${locale}/login`} className="px-5 py-2.5 bg-green-700 text-white rounded-full font-medium hover:bg-green-800 transition-colors text-sm">
          {isFr ? 'Se connecter' : 'تسجيل الدخول'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Heart className="h-6 w-6 text-red-500 fill-red-500" />
        {t.title}
        {!isLoading && <span className="text-gray-400 text-lg font-normal">({favorites.length})</span>}
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-56 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <Heart className="h-16 w-16 text-gray-200" />
          <p className="text-gray-500">{t.empty}</p>
          <Link href={`/${locale}/products`} className="px-5 py-2.5 bg-green-700 text-white rounded-full font-medium hover:bg-green-800 transition-colors text-sm">
            {t.browse}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              {product.imageUrl && (
                <Link href={`/${locale}/products/${product.id}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.imageUrl}
                    alt={isFr ? product.nameFr : product.nameAr}
                    className="w-full h-40 object-cover"
                  />
                </Link>
              )}
              <CardContent className="p-4">
                <Link href={`/${locale}/products/${product.id}`}>
                  <h3 className="font-semibold text-gray-900 truncate hover:text-green-700 transition-colors">
                    {isFr ? product.nameFr : product.nameAr}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 mb-3">{product.unit}</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-gray-900">
                    {Number(product.price).toLocaleString('fr-DZ')} DZD
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/${locale}/products/${product.id}`}
                      className="p-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                      title={t.cart}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleRemove(product.id)}
                      disabled={removing === product.id}
                      className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                      title={t.remove}
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

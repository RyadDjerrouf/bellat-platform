"use client";

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { addFavorite, removeFavorite, fetchFavorites } from '@/lib/api';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  productId: string;
  locale: string;
}

export function FavoriteButton({ productId, locale }: FavoriteButtonProps) {
  const { token, isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isFr = locale !== 'ar';

  // Check initial favorite state
  useEffect(() => {
    if (!token) return;
    fetchFavorites(token).then((favs) => {
      setIsFavorited(favs.some((f) => f.id === productId));
    });
  }, [token, productId]);

  if (!isAuthenticated) return null;

  const toggle = async () => {
    if (!token || isLoading) return;
    setIsLoading(true);
    try {
      if (isFavorited) {
        await removeFavorite(token, productId);
        setIsFavorited(false);
        toast.success(isFr ? 'Retiré des favoris' : 'تمت الإزالة من المفضلة');
      } else {
        await addFavorite(token, productId);
        setIsFavorited(true);
        toast.success(isFr ? 'Ajouté aux favoris' : 'تمت الإضافة إلى المفضلة');
      }
    } catch {
      toast.error(isFr ? 'Erreur' : 'خطأ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={isLoading}
      title={isFavorited
        ? (isFr ? 'Retirer des favoris' : 'إزالة من المفضلة')
        : (isFr ? 'Ajouter aux favoris' : 'إضافة إلى المفضلة')}
      className={`p-2.5 rounded-full border transition-colors disabled:opacity-50 ${
        isFavorited
          ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
          : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-red-400'
      }`}
    >
      <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500' : ''}`} />
    </button>
  );
}

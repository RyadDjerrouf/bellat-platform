"use client"; // This must be a client component for hover effects and interactivity

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StockBadge } from '@/components/products/StockBadge';
import { ResponsivePicture } from '@/components/ui/ResponsivePicture';
import { getOptimizedImageSrc } from '@/lib/utils/image';

interface ProductCardProps {
  product: Product;
  locale: string; // Receive locale as a prop
}

export function ProductCard({ product, locale }: ProductCardProps) {
  // Use locale prop for translations instead of useTranslations hook
  const addToCartText = locale === 'ar' ? 'إضافة إلى السلة' : 'Ajouter au panier';

  return (
    <Card className="h-full overflow-hidden transition-transform hover:scale-105 hover:shadow-xl">
      <Link href={`/${locale}/products/${product.id}`} className="block">
        <div className="relative w-full aspect-square">
          <ResponsivePicture
            src={getOptimizedImageSrc(product.image, 'full', 'webp')}
            alt={locale === 'ar' ? product.name_ar : product.name_fr}
            className="w-full h-full"
            priority={false}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.stock_status !== 'in_stock' && (
             <StockBadge 
               status={product.stock_status as 'in_stock' | 'low_stock' | 'out_of_stock'} 
               locale={locale as 'fr' | 'ar'} 
               className="absolute top-2 right-2"
             />
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 truncate">
          {locale === 'ar' ? product.name_ar : product.name_fr}
        </h3>
        <p className="text-sm text-gray-500">{product.unit}</p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-lg font-bold text-bellat-red">{product.price} DZD</p>
          <Button variant="primary" className="min-h-0 h-10 px-4 py-2 text-sm">
            {addToCartText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

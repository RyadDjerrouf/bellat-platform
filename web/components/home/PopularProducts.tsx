'use client';

import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { ProductCardSkeleton } from '@/components/products/ProductCardSkeleton';

export function PopularProducts() {
  const t = useTranslations('Common');
  const locale = useLocale();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/data/products.json');
        const data = await response.json();
        // Get first 6 products as popular products
        setProducts(data.slice(0, 6));
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-300 rounded-lg w-80 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-96 mb-12"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-800 font-medium text-sm mb-4">
            {locale === 'ar' ? '⭐ الأكثر طلباً' : '⭐ Les Plus Demandés'}
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            {locale === 'ar' ? 'المنتجات الشائعة' : 'Nos Spécialités'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {locale === 'ar' 
              ? 'اكتشف أشهى المنتجات التقليدية المختارة بعناية من أفضل المنتجين الجزائريين'
              : 'Découvrez nos délicieuses spécialités traditionnelles sélectionnées avec soin chez les meilleurs producteurs algériens'
            }
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="transform hover:scale-105 transition-all duration-300 ease-out"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <ProductCard product={product} locale={locale} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href={`/${locale}/products`}>
            <button className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <span className="mr-2">
                {locale === 'ar' ? 'عرض جميع المنتجات' : 'Voir Tous les Produits'}
              </span>
              <svg 
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

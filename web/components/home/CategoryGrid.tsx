'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { fetchCategories } from '@/lib/api';
import type { Category } from '@/types/category';

export function CategoryGrid() {
  const t = useTranslations('Common');
  const locale = useLocale();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((err) => console.error('Failed to load categories:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-300 rounded-lg w-80 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-96 mb-12"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-xl h-40"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-red-100 rounded-full text-red-800 font-medium text-sm mb-4">
            {locale === 'ar' ? '🏪 تصفح حسب الفئة' : '🏪 Parcourir par Catégorie'}
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            {locale === 'ar' ? 'فئات المنتجات' : 'Nos Catégories'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {locale === 'ar' 
              ? 'استكشف مجموعتنا المتنوعة من المنتجات الجزائرية التقليدية المنظمة بعناية'
              : 'Explorez notre gamme diversifiée de produits algériens traditionnels soigneusement organisés'
            }
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link href={`/${locale}/products/categories/${category.id}`} key={category.id}>
              <Card 
                className="group h-full bg-white border-0 shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: 'slideInUp 0.6s ease-out forwards'
                }}
              >
                <CardContent className="relative p-8 text-center">
                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Icon container */}
                  <div className="relative mb-6">
                    <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-red-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative">
                    <h3 className="font-bold text-xl text-gray-800 mb-3 group-hover:text-green-700 transition-colors duration-200">
                      {locale === 'ar' ? category.name_ar : category.name_fr}
                    </h3>
                    <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200 leading-relaxed">
                      {locale === 'ar' ? category.description_ar : category.description_fr}
                    </p>
                  </div>
                  
                  {/* Hover indicator */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-green-600 to-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href={`/${locale}/products`}>
            <button className="group inline-flex items-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200">
              <span className="mr-2">
                {locale === 'ar' ? 'عرض جميع الفئات' : 'Voir Toutes les Catégories'}
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
    </section>
  );
}

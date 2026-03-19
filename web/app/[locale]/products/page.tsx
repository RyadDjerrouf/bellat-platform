"use client";

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/Button';
import { useParams } from 'next/navigation';
import type { Product } from '@/types/product';
import type { Category } from '@/types/category';

// This is the main products listing page that shows all available products
// with category filtering
export default function ProductsPage() {
  const params = useParams();
  const locale = params.locale as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load products and categories data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/data/products.json'),
          fetch('/data/categories.json'),
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on selected category
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-lg text-gray-600">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold">
          {locale === 'ar' ? 'جميع المنتجات' : 'Tous les Produits'}
        </h1>
        <p className="text-gray-500 mt-2">
          {locale === 'ar'
            ? 'اكتشف مجموعتنا الكاملة من المنتجات الجزائرية التقليدية'
            : 'Découvrez notre gamme complète de produits algériens traditionnels'}
        </p>
      </header>

      {/* Category Filter Buttons */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="font-semibold text-gray-900">
            {locale === 'ar' ? 'تصفية حسب:' : 'Filtrer par:'}
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant={selectedCategory === null ? 'primary' : 'secondary'}
            onClick={() => setSelectedCategory(null)}
            className={`min-h-0 h-10 px-4 py-2 text-sm ${
              selectedCategory === null ? '' : 'text-gray-900 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {locale === 'ar' ? 'الكل' : 'Tout'} ({products.length})
          </Button>
          {categories.map((category) => {
            const count = products.filter((p) => p.category === category.id).length;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'primary' : 'secondary'}
                onClick={() => setSelectedCategory(category.id)}
                className={`min-h-0 h-10 px-4 py-2 text-sm ${
                  selectedCategory === category.id ? '' : 'text-gray-900 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {locale === 'ar' ? category.name_ar : category.name_fr} ({count})
              </Button>
            );
          })}
        </div>
      </div>

      {/* Products Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {locale === 'ar'
            ? `${filteredProducts.length} منتجات`
            : `${filteredProducts.length} produits`}
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      ) : (
        // Empty state
        <div className="text-center py-16">
          <p className="text-lg text-gray-600">
            {locale === 'ar'
              ? 'لم يتم العثور على منتجات في هذه الفئة'
              : 'Aucun produit trouvé dans cette catégorie'}
          </p>
        </div>
      )}
    </div>
  );
}

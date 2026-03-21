'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductCardSkeleton } from '@/components/products/ProductCardSkeleton';
import { usePathname, useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { fetchProducts, fetchAutocomplete, AutocompleteSuggestion } from '@/lib/api';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  // Extract locale from pathname
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'fr';

  // Autocomplete — fast, 200ms debounce
  useEffect(() => {
    if (suggestRef.current) clearTimeout(suggestRef.current);
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    suggestRef.current = setTimeout(async () => {
      const results = await fetchAutocomplete(searchQuery.trim());
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    }, 200);
    return () => { if (suggestRef.current) clearTimeout(suggestRef.current); };
  }, [searchQuery]);

  // Full search — 350ms debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await fetchProducts({ q: searchQuery.trim() });
        setFilteredProducts(results);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (s: AutocompleteSuggestion) => {
    setShowSuggestions(false);
    router.push(`/${locale}/products/${s.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {locale === 'ar' ? 'بحث' : 'Recherche'}
        </h1>

        {/* Search Input + Autocomplete dropdown */}
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="search"
            placeholder={locale === 'ar' ? 'ابحث عن المنتجات...' : 'Rechercher des produits...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            className="pl-10 pr-12 py-3"
            autoFocus
          />
          {searchQuery && (
            <Button
              variant="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={handleClearSearch}
              aria-label="Effacer"
            >
              <X className="h-5 w-5" />
            </Button>
          )}

          {/* Autocomplete suggestions dropdown */}
          {showSuggestions && (
            <ul className="absolute z-50 top-full mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              {suggestions.map((s) => (
                <li key={s.id}>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition-colors text-start"
                    onMouseDown={() => handleSuggestionClick(s)}
                  >
                    {s.imageUrl && (
                      <img src={s.imageUrl} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
                    )}
                    <span className="text-sm font-medium text-gray-800">
                      {locale === 'ar' ? s.nameAr : s.nameFr}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      {/* Search Results */}
      <div className="mb-6">
        {searchQuery && (
          <p className="text-gray-600 text-lg">
            {filteredProducts.length > 0
              ? locale === 'ar'
                ? `${filteredProducts.length} نتيجة لـ "${searchQuery}"`
                : `${filteredProducts.length} résultat(s) pour "${searchQuery}"`
              : locale === 'ar'
              ? `لا توجد نتائج لـ "${searchQuery}"`
              : `Aucun résultat pour "${searchQuery}"`}
          </p>
        )}
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : searchQuery && filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      ) : searchQuery && filteredProducts.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {locale === 'ar' ? 'لا توجد نتائج' : 'Aucun résultat trouvé'}
          </h3>
          <p className="text-gray-500 mb-6">
            {locale === 'ar'
              ? 'حاول استخدام كلمات مفتاحية مختلفة'
              : 'Essayez avec des mots-clés différents'}
          </p>
          <Button onClick={handleClearSearch}>
            {locale === 'ar' ? 'مسح البحث' : 'Effacer la recherche'}
          </Button>
        </div>
      ) : (
        /* Initial State */
        <div className="text-center py-16">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {locale === 'ar' ? 'ابحث عن المنتجات' : 'Rechercher des produits'}
          </h3>
          <p className="text-gray-500">
            {locale === 'ar'
              ? 'ابدأ الكتابة للبحث عن المنتجات'
              : 'Commencez à taper pour rechercher des produits'}
          </p>
        </div>
      )}
    </div>
  );
}
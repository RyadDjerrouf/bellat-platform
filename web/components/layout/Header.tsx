"use client";

import Link from 'next/link';
import { Search, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { LocaleSwitcher } from './LocaleSwitcher';
import { useTranslations, useLocale } from 'next-intl';

export function Header() {
  const t = useTranslations('Common');
  const locale = useLocale();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex h-18 items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-12 h-8 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">•</span>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Bellat
            </span>
            <div className="text-xs text-gray-500 font-medium tracking-wide">
              DIGITAL
            </div>
          </div>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <Link href={`/${locale}/search`}>
            <Button 
              variant="icon" 
              aria-label={t('Search')}
              className="relative hover:bg-gray-100 hover:scale-110 transition-all duration-200 rounded-full p-3"
            >
              <Search className="h-5 w-5 text-gray-700" />
            </Button>
          </Link>
          
          {/* Cart */}
          <Link href={`/${locale}/cart`} className="relative">
            <Button 
              variant="icon" 
              aria-label={t('Panier')} 
              className="hover:bg-gray-100 hover:scale-110 transition-all duration-200 rounded-full p-3"
            >
              <ShoppingCart className="h-5 w-5 text-gray-700" />
            </Button>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 text-xs font-bold text-white shadow-lg animate-pulse ring-2 ring-white">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          {/* Language Switcher */}
          <div className="ml-2">
            <LocaleSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}

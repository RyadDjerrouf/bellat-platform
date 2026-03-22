"use client";

import Link from 'next/link';
import { Search, ShoppingCart, User, LogOut, ChevronDown, Package, MapPin, Heart, UtensilsCrossed } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { LocaleSwitcher } from './LocaleSwitcher';
import { useTranslations, useLocale } from 'next-intl';

export function Header() {
  const t = useTranslations('Common');
  const locale = useLocale();
  const { itemCount } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const ar = locale === 'ar';

  useEffect(() => { setMounted(true); }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href={`/${locale}/products`}
            className="px-3 py-2 text-sm text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors font-medium"
          >
            {ar ? 'المنتجات' : 'Produits'}
          </Link>
          <Link
            href={`/${locale}/recipes`}
            className="px-3 py-2 text-sm text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors font-medium flex items-center gap-1"
          >
            <UtensilsCrossed className="h-3.5 w-3.5" />
            {ar ? 'الوصفات' : 'Recettes'}
          </Link>
        </div>

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
            {mounted && itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 text-xs font-bold text-white shadow-lg animate-pulse ring-2 ring-white">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          {/* Account */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setAccountOpen((v) => !v)}
                aria-label={ar ? 'حسابي' : 'Mon compte'}
                className="flex items-center gap-1 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <User className="h-5 w-5 text-gray-700" />
                <ChevronDown className={`h-3 w-3 text-gray-500 transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
              </button>
              {accountOpen && (
                <div className="absolute end-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <Link
                    href={`/${locale}/profile`}
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="h-4 w-4 text-gray-400" />
                    {ar ? 'ملفي الشخصي' : 'Mon profil'}
                  </Link>
                  <Link
                    href={`/${locale}/orders`}
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Package className="h-4 w-4 text-gray-400" />
                    {ar ? 'طلباتي' : 'Mes commandes'}
                  </Link>
                  <Link
                    href={`/${locale}/addresses`}
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {ar ? 'عناويني' : 'Mes adresses'}
                  </Link>
                  <Link
                    href={`/${locale}/favorites`}
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Heart className="h-4 w-4 text-gray-400" />
                    {ar ? 'المفضلة' : 'Mes favoris'}
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={() => { logout(); setAccountOpen(false); }}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-start"
                  >
                    <LogOut className="h-4 w-4" />
                    {ar ? 'تسجيل الخروج' : 'Se déconnecter'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href={`/${locale}/login`}>
              <Button variant="secondary" className="text-sm px-3 py-1.5 h-auto min-h-0">
                {ar ? 'دخول' : 'Connexion'}
              </Button>
            </Link>
          )}

          {/* Language Switcher */}
          <div className="ml-2">
            <LocaleSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}

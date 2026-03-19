"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { clsx } from 'clsx';

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const handleChangeLocale = (newLocale: string) => {
    // Replace the current locale segment in the URL with the new locale
    // This assumes the locale is the first segment after the base URL (e.g., /fr/products/...)
    const newPath = `/${newLocale}${pathname.substring(3)}`; // Adjust substring index if base path changes
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="secondary"
        className={clsx("min-h-0 h-11 px-4 py-2 text-sm", {
          "bg-bellat-red text-white hover:bg-bellat-red-dark": currentLocale === 'fr',
          "bg-white text-bellat-red border-2 border-bellat-red hover:bg-bellat-gray-light": currentLocale !== 'fr',
        })}
        onClick={() => handleChangeLocale('fr')}
      >
        FR
      </Button>
      <Button
        variant="secondary"
        className={clsx("min-h-0 h-11 px-4 py-2 text-sm", {
          "bg-bellat-red text-white hover:bg-bellat-red-dark": currentLocale === 'ar',
          "bg-white text-bellat-red border-2 border-bellat-red hover:bg-bellat-gray-light": currentLocale !== 'ar',
        })}
        onClick={() => handleChangeLocale('ar')}
      >
        AR
      </Button>
    </div>
  );
}

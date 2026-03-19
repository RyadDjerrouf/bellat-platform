/**
 * Format price in Algerian Dinars (DZD)
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString('fr-FR')} DZD`;
}

/**
 * Format price with currency symbol for Arabic locale
 */
export function formatPriceArabic(price: number): string {
  return `${price.toLocaleString('ar-DZ')} دج`;
}

/**
 * Format price based on locale
 */
export function formatPriceByLocale(price: number, locale: 'fr' | 'ar'): string {
  return locale === 'ar' ? formatPriceArabic(price) : formatPrice(price);
}
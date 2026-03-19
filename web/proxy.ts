import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['fr', 'ar'],
  defaultLocale: 'fr',
  localePrefix: 'always'
});

export const config = {
  // Match only internationalized pathnames (exclude admin routes)
  matcher: ['/((?!api|_next|_vercel|admin|.*\\..*).*)']
};

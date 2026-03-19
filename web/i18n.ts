import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async ({ requestLocale }) => {
  // Get locale from request or use default
  let locale = await requestLocale;

  // If locale is still not available, try to get it from headers
  if (!locale) {
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '';
    const match = pathname.match(/^\/(fr|ar)(\/|$)/);
    locale = match ? match[1] : 'fr';
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});

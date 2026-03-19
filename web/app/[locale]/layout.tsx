import { Inter } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'sonner';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomNav } from '@/components/layout/BottomNav';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Generate static params for both locales
export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'ar' }];
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const isRTL = locale === 'ar';

  // Get messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <BottomNav />
            </div>
            <Toaster position="top-center" />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
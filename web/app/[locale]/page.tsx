import { HeroSection } from '@/components/home/HeroSection';
import { PopularProducts } from '@/components/home/PopularProducts';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturesSection } from '@/components/home/FeaturesSection';

type Props = {
  params: Promise<{ locale: string }>;
};

// Generate static params for both locales
export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'ar' }];
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  return (
    <main className="min-h-screen">
      <HeroSection locale={locale} />

      <PopularProducts />

      <CategoryGrid />

      <FeaturesSection locale={locale} />
    </main>
  );
}
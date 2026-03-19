import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

interface HeroSectionProps {
  locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/page/BellatHomePage.png"
          alt="Bellat Homepage Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        <h1 className="mb-6 text-5xl md:text-7xl font-bold leading-tight tracking-tight">
          {locale === 'ar' ? (
            <span className="block">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-white to-green-200">منصة</span>
              <span className="block text-red-400 mt-2">بلاط الرقمية</span>
            </span>
          ) : (
            <span className="block">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-white to-green-200">Bellat</span>
              <span className="block text-red-400 mt-2">Digital</span>
            </span>
          )}
        </h1>
        
        <p className="mb-12 text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed text-gray-100">
          {locale === 'ar' 
            ? 'اكتشف النكهات الجزائرية الأصيلة • منتجات طازجة يومياً • توصيل سريع لباب منزلك'
            : 'Découvrez les saveurs authentiques d\'Algérie • Produits frais quotidiens • Livraison rapide à votre porte'
          }
        </p>
        
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-center sm:gap-8">
          <Link href={`/${locale}/products`}>
            <Button 
              size="lg" 
              className="bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
            >
              {locale === 'ar' ? 'تسوق الآن' : 'Commander Maintenant'}
            </Button>
          </Link>
          
          <Link href={`#about`}>
            <Button 
              variant="secondary" 
              size="lg" 
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-4 rounded-xl transition-all duration-200 w-full sm:w-auto"
            >
              {locale === 'ar' ? 'اعرف المزيد' : 'En Savoir Plus'}
            </Button>
          </Link>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-1 h-8 bg-white/50 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}

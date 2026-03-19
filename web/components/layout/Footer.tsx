import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useTranslations } from 'next-intl'; // Import useTranslations

export function Footer() {
  const t = useTranslations('Common'); // Initialize translations for the 'Common' namespace

  return (
    <footer className="bg-gray-dark text-white">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 py-12">
        <div>
          <h3 className="font-bold text-lg text-bellat-red">{t('Bellat')}</h3>
          <p className="mt-2 text-sm text-gray-300">
            {t('QualitySince')}
          </p>
        </div>
        <div>
          <h4 className="font-semibold">{t('Navigation')}</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/products" className="hover:text-bellat-red">{t('Products')}</Link></li>
            <li><Link href="/about" className="hover:text-bellat-red">{t('AboutUs')}</Link></li>
            <li><Link href="/contact" className="hover:text-bellat-red">{t('ContactUs')}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">{t('ContactUs')}</h4>
          <p className="mt-4 text-sm text-gray-300">Tessala-El-Merdja, Algeria</p>
          <p className="text-sm text-gray-300">contact@bellat.dz</p>
        </div>
        <div>
          <h4 className="font-semibold">{t('FollowUs')}</h4>
          <div className="mt-4 flex space-x-4">
            <a href="#" aria-label="Facebook" className="hover:text-bellat-red">
              <Facebook />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-bellat-red">
              <Instagram />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-bellat-red">
              <Twitter />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 py-6">
        <p className="text-center text-sm text-gray-400">
          © {new Date().getFullYear()} {t('Bellat')} Group. {t('AllRightsReserved')}.
        </p>
      </div>
    </footer>
  );
}

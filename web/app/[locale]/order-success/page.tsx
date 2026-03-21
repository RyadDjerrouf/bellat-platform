"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const orderId = searchParams.get('orderId');

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <CheckCircle2 className="mx-auto h-24 w-24 text-green-500" />

      <h1 className="mt-6 text-2xl font-bold">
        {locale === 'ar' ? 'تم تأكيد طلبك!' : 'Commande confirmée !'}
      </h1>
      <p className="mt-2 text-gray-500">
        {locale === 'ar'
          ? 'شكراً لثقتك بنا. طلبك قيد التحضير.'
          : 'Merci pour votre confiance. Votre commande est en cours de préparation.'}
      </p>

      {orderId && (
        <div className="mt-8 p-4 inline-block bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-500">
            {locale === 'ar' ? 'رقم الطلب:' : 'Numéro de commande :'}
          </p>
          <p className="font-bold text-lg font-mono">{orderId}</p>
        </div>
      )}

      <div className="mt-8 flex justify-center gap-4">
        <Link href={`/${locale}/orders`}>
          <Button variant="secondary">
            {locale === 'ar' ? 'عرض طلباتي' : 'Voir mes commandes'}
          </Button>
        </Link>
        <Link href={`/${locale}`}>
          <Button>
            {locale === 'ar' ? 'العودة للرئيسية' : "Retour à l'accueil"}
          </Button>
        </Link>
      </div>
    </div>
  );
}

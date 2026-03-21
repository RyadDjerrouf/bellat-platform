"use client";

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { toast } from 'sonner';
import { forgotPassword } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function ForgotPasswordPage() {
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const isAr = locale === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {isAr ? 'نسيت كلمة المرور' : 'Mot de passe oublié'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-700 text-sm">
                {isAr
                  ? 'إذا كان هذا البريد الإلكتروني مسجلاً، سيتم إرسال رابط إعادة التعيين.'
                  : 'Si cet email est enregistré, un lien de réinitialisation a été envoyé.'}
              </p>
              <Link href={`/${locale}/login`} className="text-green-700 font-medium underline text-sm">
                {isAr ? 'العودة إلى تسجيل الدخول' : 'Retour à la connexion'}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-gray-600">
                {isAr
                  ? 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور.'
                  : 'Entrez votre email et nous vous enverrons un lien de réinitialisation.'}
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isAr ? 'البريد الإلكتروني' : 'Email'}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="vous@example.com"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? '...' : (isAr ? 'إرسال رابط الإعادة' : 'Envoyer le lien')}
              </Button>
              <p className="text-center text-sm text-gray-500">
                <Link href={`/${locale}/login`} className="text-green-700 font-medium underline">
                  {isAr ? 'العودة إلى تسجيل الدخول' : 'Retour à la connexion'}
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

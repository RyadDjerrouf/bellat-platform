"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { loginUser, registerUser } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const { login } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register-only fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let result: { accessToken: string; refreshToken: string };
      if (mode === 'login') {
        result = await loginUser(email, password);
      } else {
        result = await registerUser(fullName, email, password, phone || undefined);
      }
      login(result.accessToken, result.refreshToken);
      toast.success(locale === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Connexion réussie');
      router.back();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setIsLoading(false);
    }
  };

  const t = {
    title: {
      login: locale === 'ar' ? 'تسجيل الدخول' : 'Se connecter',
      register: locale === 'ar' ? 'إنشاء حساب' : 'Créer un compte',
    },
    switchPrompt: {
      login: locale === 'ar' ? 'ليس لديك حساب؟' : 'Pas encore de compte ?',
      register: locale === 'ar' ? 'لديك حساب بالفعل؟' : 'Déjà un compte ?',
    },
    switchAction: {
      login: locale === 'ar' ? 'إنشاء حساب' : "S'inscrire",
      register: locale === 'ar' ? 'تسجيل الدخول' : 'Se connecter',
    },
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {t.title[mode]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {locale === 'ar' ? 'الاسم الكامل' : 'Nom complet'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Amine Benali"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
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

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {locale === 'ar' ? 'رقم الهاتف (اختياري)' : 'Téléphone (optionnel)'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="+213555123456"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {locale === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '...' : t.title[mode]}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            {t.switchPrompt[mode]}{' '}
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-green-700 font-medium underline"
            >
              {t.switchAction[mode]}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { fetchProfile, updateProfile, deleteAccount, type UserProfile } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  const router = useRouter();
  const locale = useLocale();
  const { token, isAuthenticated, logout } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Editable fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPwSection, setShowPwSection] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const ar = locale === 'ar';

  useEffect(() => {
    if (!isAuthenticated) { router.replace(`/${locale}/login`); return; }
    fetchProfile(token!).then((p) => {
      if (!p) return;
      setProfile(p);
      setFullName(p.fullName);
      setPhoneNumber(p.phoneNumber ?? '');
    }).finally(() => setIsLoading(false));
  }, [isAuthenticated, token, locale, router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await updateProfile(token!, { fullName, phoneNumber: phoneNumber || undefined });
      setProfile(updated);
      toast.success(ar ? 'تم تحديث الملف الشخصي' : 'Profil mis à jour');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error(ar ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Minimum 8 caractères');
      return;
    }
    setIsSaving(true);
    try {
      await updateProfile(token!, { currentPassword, newPassword });
      toast.success(ar ? 'تم تغيير كلمة المرور' : 'Mot de passe modifié');
      setCurrentPassword('');
      setNewPassword('');
      setShowPwSection(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount(token!);
      logout();
      router.push(`/${locale}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-xl">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{ar ? 'الملف الشخصي' : 'Mon profil'}</h1>
        <p className="text-sm text-gray-500 mt-1">{profile?.email}</p>
      </header>

      {/* Profile info */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">{ar ? 'المعلومات الشخصية' : 'Informations personnelles'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {ar ? 'الاسم الكامل' : 'Nom complet'}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {ar ? 'رقم الهاتف' : 'Téléphone'}
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+213555123456"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving ? '...' : ar ? 'حفظ' : 'Enregistrer'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password change */}
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{ar ? 'كلمة المرور' : 'Mot de passe'}</CardTitle>
            <button
              onClick={() => setShowPwSection((v) => !v)}
              className="text-sm text-green-700 hover:underline"
            >
              {showPwSection
                ? ar ? 'إخفاء' : 'Annuler'
                : ar ? 'تغيير' : 'Modifier'}
            </button>
          </div>
        </CardHeader>
        {showPwSection && (
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {ar ? 'كلمة المرور الحالية' : 'Mot de passe actuel'}
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {ar ? 'كلمة المرور الجديدة' : 'Nouveau mot de passe'}
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? '...' : ar ? 'تغيير كلمة المرور' : 'Changer le mot de passe'}
              </Button>
            </form>
          </CardContent>
        )}
      </Card>
      {/* Danger zone — delete account */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-base text-red-700">{ar ? 'منطقة الخطر' : 'Zone de danger'}</CardTitle>
        </CardHeader>
        <CardContent>
          {showDeleteConfirm ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-700">
                {ar
                  ? 'هذا الإجراء لا يمكن التراجع عنه. سيتم حذف حسابك نهائياً.'
                  : 'Cette action est irréversible. Votre compte sera définitivement supprimé.'}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {isDeleting ? '...' : ar ? 'تأكيد الحذف' : 'Confirmer la suppression'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {ar ? 'إلغاء' : 'Annuler'}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-sm text-red-600 hover:text-red-700 hover:underline"
            >
              {ar ? 'حذف حسابي' : 'Supprimer mon compte'}
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

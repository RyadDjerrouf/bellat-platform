"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { toast } from 'sonner';

// Hardcoded admin credentials as per the functional specification.
const ADMIN_EMAIL = 'admin@bellat.net';
const ADMIN_PASSWORD = 'demo123';

// This is the Admin Login Page. It's a Client Component to handle form
// input, authentication logic, and client-side redirection.
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Handle form submission for login
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check against hardcoded credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // On successful login, store a flag in localStorage and redirect to dashboard.
      localStorage.setItem('isAdminLoggedIn', 'true');
      toast.success('Connexion réussie!');
      router.push('/admin/dashboard');
    } else {
      // On failed login, show an error toast.
      toast.error('Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-bellat-red via-bellat-red-dark to-gray-900 p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-bellat-red/20 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md relative shadow-2xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="text-center pb-8 pt-10">
          {/* Logo with better styling */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-linear-to-br from-bellat-red to-bellat-red-dark rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl font-bold">B</span>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Administration Bellat</CardTitle>
          <p className="text-gray-500 text-sm">Connectez-vous pour accéder au tableau de bord</p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 px-8">
            {/* Email Input with modern styling */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium text-sm">Adresse e-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@bellat.net"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-gray-300 focus:border-bellat-red focus:ring-bellat-red/20 rounded-lg"
                required
              />
            </div>
            {/* Password Input with Toggle and modern styling */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium text-sm">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-12 border-gray-300 focus:border-bellat-red focus:ring-bellat-red/20 rounded-lg"
                  required
                />
                <Button
                  type="button"
                  variant="icon"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-gray-100 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-8 pb-8 pt-2">
            <Button
              type="submit"
              className="w-full h-12 bg-linear-to-r from-bellat-red to-bellat-red-dark hover:from-bellat-red-dark hover:to-bellat-red text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Se connecter
            </Button>
          </CardFooter>
        </form>

        {/* Footer note */}
        <div className="text-center pb-6 text-xs text-gray-500">
          Prototype de démonstration • Bellat Digital Platform
        </div>
      </Card>
    </div>
  );
}

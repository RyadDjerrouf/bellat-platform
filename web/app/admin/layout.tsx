"use client";

import '../globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast, Toaster } from 'sonner';

// This is the layout for the admin section. It acts as a protected route
// by checking if the user is authenticated.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Check authentication status using lazy initialization
  const [authState, setAuthState] = useState(() => {
    if (typeof window === 'undefined') {
      return { isLoggedIn: false, isLoading: true };
    }
    const loggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    return { isLoggedIn: loggedIn, isLoading: false };
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (typeof window !== 'undefined' && !authState.isLoggedIn && window.location.pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [authState.isLoggedIn, router]);

  // Handle admin logout
  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    setAuthState({ isLoggedIn: false, isLoading: false });
    toast.info('Déconnexion réussie.');
    router.push('/admin/login');
  };

  // Show loading state during initial check
  if (authState.isLoading) {
    return null;
  }

  // If not logged in and on login page, show login page without sidebar
  if (!authState.isLoggedIn) {
    return (
      <>
        {children}
        <Toaster position="top-center" />
      </>
    );
  }

  // Render the admin dashboard layout if logged in
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Modern Sidebar Navigation */}
      <aside className="w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold bg-linear-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
            Bellat Admin
          </h2>
        </div>
        <nav className="grow p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors group">
                <LayoutDashboard className="h-5 w-5 group-hover:text-green-600" /> 
                <span className="font-medium">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors group">
                <ShoppingCart className="h-5 w-5 group-hover:text-green-600" /> 
                <span className="font-medium">Commandes</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors group">
                <Package className="h-5 w-5 group-hover:text-green-600" /> 
                <span className="font-medium">Produits</span>
              </Link>
            </li>
          </ul>
        </nav>
        {/* Modern Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={handleLogout}
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            <LogOut className="h-4 w-4 mr-2" /> Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="grow flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Administration • Bellat Platform
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-linear-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                A
              </div>
            </div>
          </div>
        </header>
        <main className="grow p-8 bg-gray-50">
          {children}
        </main>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}

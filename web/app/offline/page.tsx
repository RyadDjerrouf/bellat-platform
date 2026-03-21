import Link from 'next/link';
import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="p-5 bg-gray-100 rounded-full mb-6">
        <WifiOff className="h-12 w-12 text-gray-400" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Vous êtes hors ligne</h1>
      <p className="text-gray-500 mb-8 max-w-xs">
        Vérifiez votre connexion internet et réessayez.
      </p>
      <Link
        href="/fr"
        className="px-6 py-3 bg-green-700 text-white rounded-full font-medium hover:bg-green-800 transition-colors"
      >
        Réessayer
      </Link>
    </div>
  );
}

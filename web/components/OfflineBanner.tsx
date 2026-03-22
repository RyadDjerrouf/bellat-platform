"use client";

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function OfflineBanner() {
  const locale = useLocale();
  const ar = locale === 'ar';
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Set initial state — eslint rule doesn't apply here (syncing to navigator.onLine)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOffline(!navigator.onLine);

    const goOffline = () => setIsOffline(true);
    const goOnline  = () => setIsOffline(false);

    window.addEventListener('offline', goOffline);
    window.addEventListener('online',  goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online',  goOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="alert"
      className="fixed top-0 inset-x-0 z-[100] bg-gray-900 text-white py-2 px-4 flex items-center justify-center gap-2 text-sm"
    >
      <WifiOff className="h-4 w-4 shrink-0" />
      <span>
        {ar
          ? 'أنت غير متصل بالإنترنت — بعض الميزات غير متاحة'
          : 'Vous êtes hors ligne — certaines fonctionnalités sont indisponibles'}
      </span>
    </div>
  );
}

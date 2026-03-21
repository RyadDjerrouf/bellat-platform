"use client";

import { useEffect } from 'react';

/** Registers /sw.js silently. Renders nothing. */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => console.warn('[SW] Registration failed:', err));
    }
  }, []);

  return null;
}

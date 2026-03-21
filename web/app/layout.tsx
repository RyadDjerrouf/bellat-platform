import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#16a34a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Allow pinch-zoom — restricting it harms accessibility (WCAG 1.4.4)
};

export const metadata: Metadata = {
  title: 'Bellat - Conserverie de Viandes d\'Algérie',
  description: 'Commander vos produits halal Bellat en ligne — livraison à domicile.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Bellat',
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Root layout - just pass through to locale layout which handles html/body
  return children;
}

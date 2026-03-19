import type { ReactNode } from 'react';

export const metadata = {
  title: 'Bellat - Traditional Algerian Products',
  description: 'Discover authentic Algerian products and traditional crafts.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Root layout - just pass through to locale layout which handles html/body
  return children;
}

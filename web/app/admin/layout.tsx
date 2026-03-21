import type { ReactNode } from 'react';
import '../globals.css';
import AdminLayoutClient from './AdminLayoutClient';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AdminLayoutClient>{children}</AdminLayoutClient>
      </body>
    </html>
  );
}

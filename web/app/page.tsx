import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect root access to default French locale
  redirect('/fr');
}
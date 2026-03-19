"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CheckCircle2 } from 'lucide-react';

// Generate order number function
const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const randomId = String(Math.floor(Math.random() * 10000)).padStart(5, '0');
  return `BLT-${year}${month}${day}-${randomId}`;
};

// This is the Order Success page, shown after a user "confirms" their order.
export default function OrderSuccessPage() {
  // State to hold the randomly generated fake order number.
  const [orderNumber] = useState(generateOrderNumber);

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <CheckCircle2 className="mx-auto h-24 w-24 text-green-500" />
      <h1 className="mt-6 text-2xl font-bold">Commande confirmée!</h1>
      <p className="mt-2 text-gray-500">
        Merci pour votre confiance. Votre commande est en cours de préparation.
      </p>
      
      {/* Display the fake order number once it's generated */}
      {orderNumber && (
        <div className="mt-8 p-4 inline-block bg-gray-100 rounded-lg">
          <p className="text-sm">Numéro de commande:</p>
          <p className="font-bold text-lg">{orderNumber}</p>
        </div>
      )}

      <div className="mt-8">
        <Link href="/">
          <Button>Retour à l&apos;accueil</Button>
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useCart } from '@/context/CartContext';
import { CartItem } from '@/components/cart/CartItem';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

// This is the Cart Page. It's a Client Component because it needs to
// access the client-side cart state and allow for user interaction.
export default function CartPage() {
  // Get all cart-related data and functions from our custom hook
  const { cartItems, itemCount } = useCart();

  // Calculate the subtotal of all items in the cart
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // If the cart is empty, display a message and a link to browse products.
  // This matches the "Empty Cart State" from the functional specification.
  if (itemCount === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingCart className="mx-auto h-24 w-24 text-gray-400" />
        <h1 className="mt-6 text-2xl font-bold">Votre panier est vide</h1>
        <p className="mt-2 text-gray-500">
          Parcourez nos catégories pour trouver quelque chose de délicieux.
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button>Parcourir les produits</Button>
          </Link>
        </div>
      </div>
    );
  }

  // If the cart has items, display the list and the order summary.
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Votre Panier</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1: List of cart items */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0 divide-y">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Column 2: Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span className="font-semibold">{subtotal} DZD</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Livraison</span>
                <span>Calculée à l&apos;étape suivante</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/checkout/address" className="w-full">
                <Button className="w-full">
                  Commander - {subtotal} DZD
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <div className="text-center mt-4">
             <Link href="/" className="text-sm text-gray-600 hover:underline">
                Continuer mes achats
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCheckout } from '@/context/CheckoutContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { useLocale } from 'next-intl';

// This is the final step of the checkout: the Order Review page.
export default function ReviewPage() {
  const router = useRouter();
  const locale = useLocale();
  const { cartItems, clearCart } = useCart();
  const { address, slot, setAddress, setSlot } = useCheckout(); // Get setters to clear state

  // This effect ensures the user has completed the previous steps.
  // If address or slot info is missing, it redirects them back to the start of the checkout.
  useEffect(() => {
    if (!address || !slot) {
      router.replace('/checkout/address');
    }
  }, [address, slot, router]);

  // Calculate the subtotal from all items in the cart.
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  
  // Determine the delivery fee based on the selected time slot, as per the spec.
  const deliveryFee = slot?.time.includes('Soir') ? 450 : 250;
  
  // Calculate the final total.
  const total = subtotal + deliveryFee;

  // This function is called when the user confirms their order.
  const handleConfirmOrder = () => {
    // In a real application, this is where you would send the order to your backend API.
    // For the prototype, we simply clear the cart and redirect to success page.

    // After "placing" the order, clear the cart and the checkout session state.
    clearCart();
    setAddress(null);
    setSlot(null);

    // Redirect the user to the order success page.
    router.push('/order-success');
  };

  // Render a loading state or null if the context data isn't available yet.
  // This prevents errors during the initial render or if the user lands here directly.
  if (!address || !slot) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Confirmation de la commande</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Delivery Address Summary */}
          <div>
            <h3 className="font-semibold">Livraison à:</h3>
            <div className="text-sm text-gray-600 mt-2 p-4 bg-gray-50 rounded-lg border">
              <p className="font-bold">{address.fullName}</p>
              <p>{address.phone}</p>
              <p>{address.address}</p>
              <p>{address.commune}, {address.wilaya}</p>
            </div>
          </div>

          {/* Delivery Slot Summary */}
          <div>
            <h3 className="font-semibold">Date de livraison:</h3>
            <p className="text-sm text-gray-600">{slot.date}, {slot.time}</p>
          </div>

          {/* Items Summary */}
          <div>
            <h3 className="font-semibold">Articles ({cartItems.length})</h3>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              {cartItems.map(item => (
                <li key={item.id} className="flex justify-between">
                  <span>{locale === 'ar' ? item.name_ar : item.name_fr} x{item.quantity}</span>
                  <span>{item.price * item.quantity} DZD</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Financial Summary */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Sous-total</span>
              <span>{subtotal} DZD</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Livraison</span>
              <span>{deliveryFee} DZD</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{total} DZD</span>
            </div>
             <div className="text-sm text-gray-500 pt-4">
              Paiement: Espèces à la livraison
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleConfirmOrder} className="w-full">
            Confirmer la commande
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

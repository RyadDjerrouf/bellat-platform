"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import { useCheckout } from '@/context/CheckoutContext';
import { useAuth } from '@/context/AuthContext';
import { placeOrder } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';

export default function ReviewPage() {
  const router = useRouter();
  const locale = useLocale();
  const { cartItems, clearCart } = useCart();
  const { address, slot, setAddress, setSlot } = useCheckout();
  const { token, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if checkout steps weren't completed
  useEffect(() => {
    if (!address || !slot) {
      router.replace(`/${locale}/checkout/address`);
    }
  }, [address, slot, router, locale]);

  if (!address || !slot) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal; // Free delivery (B2B)

  const handleConfirmOrder = async () => {
    if (!isAuthenticated || !token) {
      toast.error(
        locale === 'ar'
          ? 'يجب تسجيل الدخول لإتمام الطلب'
          : 'Vous devez être connecté pour passer une commande',
      );
      router.push(`/${locale}/login`);
      return;
    }

    if (cartItems.length === 0) {
      toast.error(locale === 'ar' ? 'السلة فارغة' : 'Votre panier est vide');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await placeOrder(
        {
          items: cartItems.map((item) => ({ productId: item.id, quantity: item.quantity })),
          deliveryAddress: {
            fullName: address.fullName,
            phoneNumber: address.phone,
            addressLine1: address.address,
            wilaya: address.wilaya,
            commune: address.commune,
          },
          deliverySlotDate: slot.date,
          deliverySlotTime: slot.time,
          paymentMethod: 'cash_on_delivery',
        },
        token,
      );

      clearCart();
      setAddress(null);
      setSlot(null);
      router.push(`/${locale}/order-success?orderId=${order.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la commande');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            {locale === 'ar' ? 'تأكيد الطلب' : 'Confirmation de la commande'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Auth warning */}
          {!isAuthenticated && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              {locale === 'ar'
                ? 'يجب تسجيل الدخول لإتمام الطلب.'
                : 'Vous devez être connecté pour confirmer la commande.'}{' '}
              <button
                onClick={() => router.push(`/${locale}/login`)}
                className="underline font-medium"
              >
                {locale === 'ar' ? 'تسجيل الدخول' : 'Se connecter'}
              </button>
            </div>
          )}

          {/* Delivery address */}
          <div>
            <h3 className="font-semibold">
              {locale === 'ar' ? 'عنوان التوصيل:' : 'Livraison à:'}
            </h3>
            <div className="text-sm text-gray-600 mt-2 p-4 bg-gray-50 rounded-lg border">
              <p className="font-bold">{address.fullName}</p>
              <p>{address.phone}</p>
              <p>{address.address}</p>
              <p>{address.commune}, {address.wilaya}</p>
            </div>
          </div>

          {/* Delivery slot */}
          <div>
            <h3 className="font-semibold">
              {locale === 'ar' ? 'موعد التوصيل:' : 'Date de livraison:'}
            </h3>
            <p className="text-sm text-gray-600">{slot.date}, {slot.time}</p>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-semibold">
              {locale === 'ar' ? `المنتجات (${cartItems.length})` : `Articles (${cartItems.length})`}
            </h3>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>{locale === 'ar' ? item.name_ar : item.name_fr} ×{item.quantity}</span>
                  <span>{item.price * item.quantity} DZD</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Totals */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>{locale === 'ar' ? 'المجموع الجزئي' : 'Sous-total'}</span>
              <span>{subtotal} DZD</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{locale === 'ar' ? 'التوصيل' : 'Livraison'}</span>
              <span className="text-green-600 font-medium">
                {locale === 'ar' ? 'مجاني' : 'Gratuite'}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>{locale === 'ar' ? 'الإجمالي' : 'Total'}</span>
              <span>{total} DZD</span>
            </div>
            <div className="text-sm text-gray-500 pt-4">
              {locale === 'ar' ? 'الدفع: نقدًا عند التسليم' : 'Paiement: Espèces à la livraison'}
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleConfirmOrder}
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? (locale === 'ar' ? 'جارٍ الإرسال...' : 'Envoi en cours...')
              : (locale === 'ar' ? 'تأكيد الطلب' : 'Confirmer la commande')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

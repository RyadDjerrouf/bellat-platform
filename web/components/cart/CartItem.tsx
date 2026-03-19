"use client";

import Image from 'next/image';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/types/cart';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

// Define the props, which is a single cart item
interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  // Get the functions to modify the cart from the context
  const { updateQuantity, removeFromCart } = useCart();
  const locale = useLocale();
  const t = useTranslations('Common');
  
  // Get the localized product name
  const productName = locale === 'ar' ? item.name_ar : item.name_fr;

  return (
    <div className="flex items-center gap-4 py-4 border-b">
      {/* Product Image */}
      <div className="relative h-24 w-24 shrink-0">
        <Image
          src={item.image}
          alt={productName}
          fill
          className="object-cover rounded-md"
        />
      </div>

      {/* Item Details */}
      <div className="grow">
        <Link href={`/products/${item.id}`} className="font-semibold hover:underline">
          {productName}
        </Link>
        <p className="text-sm text-gray-500">{item.price} {t('Currency')} / {item.unit}</p>
        
        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            aria-label="Decrement quantity"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="font-semibold w-8 text-center">{item.quantity}</span>
          <Button
            variant="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            aria-label="Increment quantity"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Total Price and Remove Button */}
      <div className="text-right">
        <p className="font-semibold">{item.price * item.quantity} DZD</p>
        <Button
          variant="icon"
          className="mt-2 text-gray-500 hover:text-red-500 h-8 w-8"
          onClick={() => removeFromCart(item.id)}
          aria-label="Remove item"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

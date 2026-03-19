"use client"; // This marks the component as a Client Component

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types/product';
import { QuantitySelector } from '@/components/products/QuantitySelector';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

// Define the props, which include the product to be added to the cart
interface AddToCartFormProps {
  product: Product;
  locale?: string;
}

export function AddToCartForm({ product, locale = 'fr' }: AddToCartFormProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // Use locale prop for translations instead of useTranslations hook
  const quantityText = locale === 'ar' ? 'الكمية' : 'Quantité';
  const addToCartText = locale === 'ar' ? 'إضافة إلى السلة' : 'Ajouter au panier';
  const addedToCartText = locale === 'ar' ? 'أضيف إلى السلة' : 'ajouté au panier';
  const productName = locale === 'ar' ? product.name_ar : product.name_fr;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} x ${productName} ${addedToCartText}!`);
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="mt-6 space-y-6">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <h3 className="text-sm font-semibold">{quantityText}:</h3>
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          min={1}
          max={99}
        />
      </div>

      {/* Add to Cart Button */}
      <Button
        variant="primary"
        className="w-full transition-all duration-200 active:scale-95 hover:shadow-lg"
        onClick={handleAddToCart}
      >
        {addToCartText} - {totalPrice} DZD
      </Button>
    </div>
  );
}

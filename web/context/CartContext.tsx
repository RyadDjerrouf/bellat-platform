"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '@/types/cart';
import { Product } from '@/types/product';

// 1. Define the shape of the context data
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  total: number;
  getTotalQuantityForProduct: (productId: string) => number;
}

// 2. Create the context with a default undefined value
const CartContext = createContext<CartContextType | undefined>(undefined);

// 3. Define the props for the provider component
interface CartProviderProps {
  children: ReactNode;
}

// 4. Create the CartProvider component
export function CartProvider({ children }: CartProviderProps) {
  // On initial load, try to get the cart from localStorage using lazy initialization
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const storedCart = localStorage.getItem('bellat_cart');
      if (storedCart) {
        return JSON.parse(storedCart);
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
    }
    return [];
  });

  // Whenever the cartItems state changes, save it to localStorage
  useEffect(() => {
    localStorage.setItem('bellat_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Function to add a product to the cart
  const addToCart = (product: Product, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        // If item exists, update its quantity
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // If item doesn't exist, add it to the cart
        const newItem: CartItem = {
          id: product.id,
          name_fr: product.name_fr,
          name_ar: product.name_ar,
          image: product.image,
          price: product.price,
          quantity: quantity,
          unit: product.unit,
        };
        return [...prevItems, newItem];
      }
    });
  };

  // Function to remove an item from the cart
  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Function to update the quantity of a specific item
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // If new quantity is 0 or less, remove the item
      removeFromCart(productId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Function to clear the entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate the total number of items in the cart
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calculate subtotal (sum of all item prices * quantities)
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Calculate total (for now, same as subtotal - could add shipping, tax, etc.)
  const total = subtotal;

  // Get total quantity for a specific product
  const getTotalQuantityForProduct = (productId: string) => {
    const item = cartItems.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  // 5. Provide the state and functions to children
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    total,
    getTotalQuantityForProduct,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// 6. Create a custom hook for easy access to the context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

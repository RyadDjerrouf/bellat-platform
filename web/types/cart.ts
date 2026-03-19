export type CartItem = {
  id: string; // Product ID
  name_fr: string; // Product name in French
  name_ar: string; // Product name in Arabic  
  image: string;
  price: number;
  quantity: number;
  unit: string; // e.g., "500g", "1kg"
};

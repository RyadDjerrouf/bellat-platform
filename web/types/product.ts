export type Product = {
  id: string;
  name_fr: string;
  name_ar: string;
  category: string; // Corresponds to Category['id']
  image: string;
  price: number;
  unit: string;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  description_fr: string;
  description_ar: string;
};

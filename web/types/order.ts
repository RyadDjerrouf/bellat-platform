export type OrderItem = {
  product_id: string;
  quantity: number;
  price: number; // Price at time of order
};

export type Order = {
  id: string;
  customer_name: string;
  date: string; // ISO date string
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  items: OrderItem[];
};

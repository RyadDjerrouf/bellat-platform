import { OrderStatus } from './enums';

export interface OrderItem {
  productId:       string;
  quantity:        number;
  priceAtPurchase: number;
}

export interface DeliveryAddress {
  fullName:     string;
  phoneNumber:  string;
  addressLine1: string;
  wilaya:       string;
  commune:      string;
}

export interface OrderSummary {
  id:               string;
  status:           OrderStatus;
  subtotal:         number;
  deliveryFee:      number;
  total:            number;
  deliveryAddress:  DeliveryAddress;
  deliverySlotDate: string;
  deliverySlotTime: string;
  paymentMethod:    string;
  items:            OrderItem[];
  createdAt:        string;
}

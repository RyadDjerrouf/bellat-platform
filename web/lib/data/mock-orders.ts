import { Order } from '@/types/order';
import fs from 'fs/promises';
import path from 'path';

export async function getMockOrders(): Promise<Order[]> {
  const filePath = path.join(process.cwd(), 'public/data/mock-orders.json');
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const orders = JSON.parse(data);
    return orders;
  } catch (error) {
    console.error('Failed to read mock orders data:', error);
    return [];
  }
}

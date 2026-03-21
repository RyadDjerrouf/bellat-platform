import { fetchProducts, fetchProductById } from '@/lib/api';
import type { Product } from '@/types/product';

export async function getProducts(): Promise<Product[]> {
  return fetchProducts();
}

export async function getPopularProducts(limit: number = 6): Promise<Product[]> {
  return fetchProducts({ limit: String(limit) });
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return fetchProductById(id);
}

import { Product } from '@/types/product';
import fs from 'fs/promises';
import path from 'path';

export async function getProducts(): Promise<Product[]> {
  const filePath = path.join(process.cwd(), 'public/data/products.json');
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const products = JSON.parse(data);
    return products;
  } catch (error) {
    console.error('Failed to read products data:', error);
    return [];
  }
}

// A function to get a subset of products for the homepage
export async function getPopularProducts(limit: number = 4): Promise<Product[]> {
    const products = await getProducts();
    return products.slice(0, limit);
}

// A function to get a single product by its ID
export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}

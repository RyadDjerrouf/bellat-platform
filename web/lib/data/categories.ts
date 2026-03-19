import { Category } from '@/types/category';
import fs from 'fs/promises';
import path from 'path';

export async function getCategories(): Promise<Category[]> {
  // We are in the `web` directory, so process.cwd() is /Users/ryad/bellat-prototype/web
  const filePath = path.join(process.cwd(), 'public/data/categories.json');
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const categories = JSON.parse(data);
    return categories;
  } catch (error) {
    console.error('Failed to read categories data:', error);
    return [];
  }
}

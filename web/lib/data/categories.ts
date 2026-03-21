import { fetchCategories } from '@/lib/api';
import type { Category } from '@/types/category';

export async function getCategories(): Promise<Category[]> {
  return fetchCategories();
}

import { request } from './client';
import type { Category, Service } from '../types';

export async function getServices(category?: string, maxPrice?: string): Promise<Service[]> {
  const query = new URLSearchParams();
  if (category) {
    query.append('category', category);
  }
  if (maxPrice) {
    query.append('maxPrice', maxPrice);
  }

  const path = query.toString() ? `/services?${query.toString()}` : '/services';
  const response = await request(path, {}, 'loading the services');
  return response.json();
}

export async function getCategories(): Promise<Category[]> {
  const response = await request('/services/categories', {}, 'loading the categories');
  return response.json();
}

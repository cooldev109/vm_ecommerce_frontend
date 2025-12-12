/**
 * Admin Product Service
 * Handles admin-only product management operations
 */

import api from '@/lib/api';

export interface CreateProductRequest {
  id?: string;
  category: 'CANDLES' | 'ACCESSORIES' | 'SETS';
  price: number;
  image: string;
  images?: string[];
  inStock?: boolean;
  burnTime?: string | null;
  size?: string | null;
  featured?: boolean;
  sortOrder?: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface ProductTranslationRequest {
  name: string;
  description: string;
  longDescription?: string;
  features?: string[];
}

/**
 * Create a new product
 */
export async function createProduct(data: CreateProductRequest) {
  return api.post('/products', data);
}

/**
 * Update an existing product
 */
export async function updateProduct(productId: string, data: UpdateProductRequest) {
  return api.put(`/products/${productId}`, data);
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: string) {
  return api.delete(`/products/${productId}`);
}

/**
 * Update or create product translation
 */
export async function upsertProductTranslation(
  productId: string,
  language: 'EN' | 'ES',
  data: ProductTranslationRequest
) {
  return api.put(`/products/${productId}/translations/${language}`, data);
}

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
  const response = await api.post('/products', data);
  if (!response.success) {
    throw new Error(response.error?.message || 'Error al crear producto');
  }
  return response;
}

/**
 * Update an existing product
 */
export async function updateProduct(productId: string, data: UpdateProductRequest) {
  const response = await api.put(`/products/${productId}`, data);
  if (!response.success) {
    throw new Error(response.error?.message || 'Error al actualizar producto');
  }
  return response;
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: string) {
  const response = await api.delete(`/products/${productId}`);
  if (!response.success) {
    throw new Error(response.error?.message || 'Error al eliminar producto');
  }
  return response;
}

/**
 * Update or create product translation
 */
export async function upsertProductTranslation(
  productId: string,
  language: 'EN' | 'ES',
  data: ProductTranslationRequest
) {
  const response = await api.put(`/products/${productId}/translations/${language}`, data);
  if (!response.success) {
    throw new Error(response.error?.message || 'Error al actualizar traducción');
  }
  return response;
}

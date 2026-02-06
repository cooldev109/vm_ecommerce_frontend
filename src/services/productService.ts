/**
 * Product Service
 * Handles product catalog and product details
 */

import api, { type PaginatedResponse } from '@/lib/api';
import type { Product } from '@/types';

export interface ProductFilters {
  category?: 'CANDLES' | 'ACCESSORIES' | 'SETS';
  inStock?: boolean;
  featured?: boolean;
  language?: string;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Get all products with optional filters
 */
export async function getProducts(filters?: ProductFilters) {
  const params = new URLSearchParams();

  if (filters) {
    if (filters.category) params.append('category', filters.category);
    if (filters.inStock !== undefined) params.append('inStock', String(filters.inStock));
    if (filters.featured !== undefined) params.append('featured', String(filters.featured));
    if (filters.language) params.append('language', filters.language);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));
  }

  const queryString = params.toString();
  const endpoint = queryString ? `/products?${queryString}` : '/products';

  return api.get<{ products: Product[]; pagination?: PaginatedResponse<Product>['pagination'] }>(endpoint);
}

/**
 * Get product by ID
 */
export async function getProductById(productId: string, language?: string) {
  const params = language ? `?language=${language}` : '';
  return api.get<{ product: Product }>(`/products/${productId}${params}`);
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(language?: string) {
  return getProducts({ featured: true, language });
}

/**
 * Search products
 */
export async function searchProducts(query: string, language?: string) {
  return getProducts({ search: query, language });
}

/**
 * Get all translations for a product
 */
export async function getProductTranslations(productId: string) {
  return api.get<{ productId: string; translations: Array<{ language: string; name: string; description: string; longDescription?: string; features?: string[] }> }>(`/products/${productId}/translations`);
}

// ============================================
// ADMIN TEST MODE ENDPOINTS
// ============================================

/**
 * Get test mode status (prices set to $0)
 */
export async function getTestModeStatus() {
  return api.get<{ testModeEnabled: boolean }>('/products/test-mode/status');
}

/**
 * Enable test mode (set all prices to $0 in database)
 */
export async function enableTestModePrices() {
  return api.post<{ message: string; productsUpdated: number }>('/products/test-mode/enable', {});
}

/**
 * Disable test mode (restore original prices from database)
 */
export async function disableTestModePrices() {
  return api.post<{ message: string; productsRestored: number }>('/products/test-mode/disable', {});
}

/**
 * Reset all product data (delete all products, translations, reviews, etc.)
 */
export async function resetAllProducts() {
  return api.delete<{
    message: string;
    deletedProducts: number;
    deletedTranslations: number;
    deletedReviews: number;
    deletedWishlistItems: number;
    deletedCartItems: number;
  }>('/products/reset-all');
}

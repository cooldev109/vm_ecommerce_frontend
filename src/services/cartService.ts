/**
 * Cart Service
 * Handles shopping cart operations
 */

import api from '@/lib/api';
import type { Cart, CartItem } from '@/types';

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

/**
 * Get user's cart
 */
export async function getCart() {
  return api.get<{ cart: Cart; total: number; itemCount: number }>('/cart');
}

/**
 * Add item to cart
 */
export async function addToCart(data: AddToCartRequest) {
  return api.post<{ cart: Cart; item: CartItem; total: number }>('/cart/items', data);
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(itemId: string, data: UpdateCartItemRequest) {
  return api.put<{ cart: Cart; item: CartItem; total: number }>(`/cart/items/${itemId}`, data);
}

/**
 * Remove item from cart
 */
export async function removeFromCart(itemId: string) {
  return api.delete<{ cart: Cart; total: number }>(`/cart/items/${itemId}`);
}

/**
 * Clear entire cart
 */
export async function clearCart() {
  return api.delete<{ message: string }>('/cart');
}

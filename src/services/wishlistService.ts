/**
 * Wishlist Service
 * Handles wishlist operations
 */

import api from '@/lib/api';
import type { WishlistItem } from '@/types';

export interface WishlistResponse {
  items: WishlistItem[];
  count: number;
}

/**
 * Get user's wishlist
 */
export async function getWishlist() {
  return api.get<WishlistResponse>('/wishlist');
}

/**
 * Add product to wishlist
 */
export async function addToWishlist(productId: string) {
  return api.post<{ item: WishlistItem }>(`/wishlist/${productId}`);
}

/**
 * Remove product from wishlist
 */
export async function removeFromWishlist(productId: string) {
  return api.delete<{ message: string }>(`/wishlist/${productId}`);
}

/**
 * Check if product is in wishlist
 */
export async function checkWishlistStatus(productId: string) {
  return api.get<{ inWishlist: boolean }>(`/wishlist/check/${productId}`);
}

/**
 * Review Service
 * Handles product reviews
 */

import api from '@/lib/api';

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

export interface Review {
  id: string;
  productId: string;
  rating: number;
  comment: string | null;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
  };
}

export interface UserReview extends Review {
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
}

export interface CreateReviewData {
  rating: number;
  comment?: string;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  stats: ReviewStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface UserReviewsResponse {
  reviews: UserReview[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

/**
 * Get all reviews for a product
 */
export async function getProductReviews(
  productId: string,
  page: number = 1,
  limit: number = 10
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return api.get<ReviewsResponse>(`/products/${productId}/reviews?${params}`);
}

/**
 * Create a review for a product
 */
export async function createReview(productId: string, data: CreateReviewData) {
  return api.post<{ review: Review }>(`/products/${productId}/reviews`, data);
}

/**
 * Get current user's reviews
 */
export async function getUserReviews(page: number = 1, limit: number = 10) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return api.get<UserReviewsResponse>(`/reviews/my-reviews?${params}`);
}

/**
 * Update a review
 */
export async function updateReview(reviewId: string, data: UpdateReviewData) {
  return api.put<{ review: Review }>(`/reviews/${reviewId}`, data);
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId: string) {
  return api.delete<{ message: string }>(`/reviews/${reviewId}`);
}

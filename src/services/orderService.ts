/**
 * Order Service
 * Handles order management and checkout
 */

import api from '@/lib/api';
import type { Order } from '@/types';

export interface CheckoutRequest {
  shippingAddressId: string;
}

export interface CheckoutResponse {
  order: Order;
  message: string;
}

/**
 * Checkout and create order from cart
 */
export async function checkout(data: CheckoutRequest) {
  return api.post<CheckoutResponse>('/orders/checkout', data);
}

/**
 * Get user's orders
 */
export async function getOrders(page = 1, limit = 10) {
  const response = await api.get<{ orders: Order[]; pagination: any }>(`/orders?page=${page}&limit=${limit}`);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch orders');
  }
  return response.data;
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: string) {
  const response = await api.get<{ order: Order }>(`/orders/${orderId}`);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch order');
  }
  return response.data;
}

/**
 * Cancel order (if pending)
 */
export async function cancelOrder(orderId: string) {
  const response = await api.put<{ order: Order }>(`/orders/${orderId}/cancel`, {});
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to cancel order');
  }
  return response.data;
}

// ============================================
// ADMIN ORDER MANAGEMENT
// ============================================

export interface UpdateOrderStatusRequest {
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}

export interface UpdateOrderTrackingRequest {
  trackingNumber?: string;
  carrier?: string;
  adminNotes?: string;
}

export interface OrderAnalytics {
  totalOrders: number;
  ordersByStatus: Record<string, number>;
  ordersByPaymentStatus: Record<string, number>;
  totalRevenue: number;
  paidOrdersCount: number;
  recentOrders: Order[];
  topProducts: Array<{
    productId: string;
    totalSold: number;
    product: any;
  }>;
  thisMonth: {
    orders: number;
    revenue: number;
  };
}

/**
 * Get all orders (admin)
 */
export async function getAllOrders(page = 1, limit = 20, status?: string, paymentStatus?: string) {
  let url = `/orders/admin/all?page=${page}&limit=${limit}`;
  if (status) url += `&status=${status}`;
  if (paymentStatus) url += `&paymentStatus=${paymentStatus}`;
  const response = await api.get<{ orders: Order[]; pagination: any }>(url);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch orders');
  }
  return response.data;
}

/**
 * Update order status (admin)
 */
export async function updateOrderStatus(orderId: string, data: UpdateOrderStatusRequest) {
  const response = await api.put<{ message: string; status: string }>(`/orders/admin/${orderId}/status`, data);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to update order status');
  }
  return response.data;
}

/**
 * Update order tracking information (admin)
 */
export async function updateOrderTracking(orderId: string, data: UpdateOrderTrackingRequest) {
  const response = await api.put<{ order: Order }>(`/orders/admin/${orderId}/tracking`, data);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to update order tracking');
  }
  return response.data;
}

/**
 * Get order analytics (admin)
 */
export async function getOrderAnalytics(): Promise<OrderAnalytics> {
  const response = await api.get<OrderAnalytics>('/orders/admin/analytics');
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch analytics');
  }
  return response.data;
}

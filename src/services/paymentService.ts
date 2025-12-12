/**
 * Payment Service
 * Handles Webpay payment integration
 */

import api from '@/lib/api';
import type { PaymentIntent, PaymentStatus } from '@/types';

export interface InitPaymentRequest {
  orderId: string;
}

/**
 * Initialize Webpay payment for an order
 */
export async function initWebpayPayment(data: InitPaymentRequest) {
  return api.post<PaymentIntent>('/payments/webpay/init', data);
}

/**
 * Get payment status for an order
 */
export async function getPaymentStatus(orderId: string) {
  return api.get<PaymentStatus>(`/payments/order/${orderId}`);
}

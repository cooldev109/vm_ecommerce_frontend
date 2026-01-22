/**
 * Payment Service
 * Handles Flow.cl payment integration
 */

import api from '@/lib/api';
import type { PaymentIntent, PaymentStatus } from '@/types';

export interface InitPaymentRequest {
  orderId: string;
}

/**
 * Initialize Flow payment for an order
 */
export async function initFlowPayment(data: InitPaymentRequest) {
  return api.post<PaymentIntent>('/payments/flow/init', data);
}

/**
 * Get payment status for an order
 */
export async function getPaymentStatus(orderId: string) {
  return api.get<PaymentStatus>(`/payments/order/${orderId}`);
}

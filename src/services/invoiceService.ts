/**
 * Invoice Service
 * Handles invoice generation and retrieval
 */

import api from '@/lib/api';
import type { Invoice } from '@/types';

export interface GenerateInvoiceRequest {
  orderId: string;
}

/**
 * Generate invoice for a paid order
 */
export async function generateInvoice(data: GenerateInvoiceRequest) {
  return api.post<{ invoice: Invoice }>('/invoices/generate', data);
}

/**
 * Get invoice by order ID
 */
export async function getInvoiceByOrderId(orderId: string) {
  return api.get<{ invoice: Invoice }>(`/invoices/order/${orderId}`);
}

/**
 * Get invoice PDF URL
 */
export function getInvoicePdfUrl(invoiceId: string): string {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const token = localStorage.getItem('auth_token');
  return `${baseUrl}/invoices/${invoiceId}/pdf${token ? `?token=${token}` : ''}`;
}

/**
 * Get all invoices (admin)
 */
export async function getAllInvoices(page = 1, limit = 50) {
  const response = await api.get<{ invoices: Invoice[]; pagination: any }>(`/invoices/admin/all?page=${page}&limit=${limit}`);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch invoices');
  }
  return response.data;
}

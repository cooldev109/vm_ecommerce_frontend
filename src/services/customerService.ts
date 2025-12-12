/**
 * Customer Service
 * Handles customer management (admin only)
 */

import api from '@/lib/api';

export interface Customer {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  firstName: string;
  lastName: string;
  phone: string;
  customerType: 'INDIVIDUAL' | 'BUSINESS';
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
  avgOrderValue: number;
  registrationDate: string;
  accountStatus: string;
}

export interface CustomerDetails {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
    customerType: 'INDIVIDUAL' | 'BUSINESS';
    taxId: string;
    businessName: string;
    businessTaxId: string;
    preferredLanguage: string;
    addresses: any[];
  };
  statistics: {
    totalOrders: number;
    totalSpent: number;
    avgOrderValue: number;
    lastOrderDate: string | null;
    lifetimeValue: number;
  };
  orderHistory: OrderHistoryItem[];
  registrationDate: string;
  lastActivity: string;
}

export interface OrderHistoryItem {
  id: string;
  status: string;
  paymentStatus: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerStats {
  totalCustomers: number;
  newCustomersThisMonth: number;
  topCustomers: TopCustomer[];
  customerRetentionRate: number;
  customersWithOrders: number;
  repeatCustomers: number;
}

export interface TopCustomer {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  orderCount: number;
}

/**
 * Get all customers with order statistics (admin)
 */
export async function getAllCustomers(page = 1, limit = 20, search?: string) {
  let url = `/users/admin/customers?page=${page}&limit=${limit}`;
  if (search) url += `&search=${search}`;

  const response = await api.get<{ customers: Customer[]; pagination: any }>(url);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch customers');
  }
  return response.data;
}

/**
 * Get customer details with full order history (admin)
 */
export async function getCustomerDetails(customerId: string) {
  const response = await api.get<{ customer: CustomerDetails }>(`/users/admin/customers/${customerId}`);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch customer details');
  }
  return response.data;
}

/**
 * Get customer statistics (admin)
 */
export async function getCustomerStats() {
  const response = await api.get<CustomerStats>('/users/admin/customers/stats');
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch customer statistics');
  }
  return response.data;
}

/**
 * Update customer role (admin)
 */
export async function updateCustomerRole(customerId: string, role: 'USER' | 'ADMIN') {
  const response = await api.put<{ message: string; role: string }>(`/users/admin/${customerId}/role`, { role });
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to update customer role');
  }
  return response.data;
}

/**
 * Analytics Service
 * Handles admin analytics data fetching
 */

import api from '@/lib/api';

export interface SalesDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: string;
  name: string;
  category: string;
  image: string;
  quantitySold: number;
  revenue: number;
}

export interface CategoryRevenue {
  category: string;
  revenue: number;
}

export interface RecentOrder {
  id: string;
  status: string;
  paymentStatus: string;
  total: number;
  customerName: string;
  email: string;
  itemCount: number;
  createdAt: string;
}

export interface AnalyticsData {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    thisWeek: number;
    growth: number;
    avgOrderValue: number;
  };
  orders: {
    total: number;
    thisMonth: number;
    paid: number;
    byStatus: Record<string, number>;
  };
  customers: {
    total: number;
  };
  topProducts: TopProduct[];
  revenueByCategory: CategoryRevenue[];
  salesOverTime: SalesDataPoint[];
  recentOrders: RecentOrder[];
}

/**
 * Get comprehensive analytics data
 */
export async function getAnalytics(): Promise<AnalyticsData> {
  const response = await api.get<AnalyticsData>('/admin/analytics');
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch analytics');
  }
  return response.data;
}

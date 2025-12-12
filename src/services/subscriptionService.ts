import api from '@/lib/api';

export interface SubscriptionPlan {
  id: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  name: string;
  nameEs: string;
  price: number;
  billingPeriod: string;
  billingPeriodEs: string;
  savings?: number;
  features: string[];
  featuresEs: string[];
  popular?: boolean;
  bestValue?: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PAUSED';
  startedAt: string | null;
  expiresAt: string | null;
  nextRenewal: string | null;
  autoRenew: boolean;
  paymentMethod?: string;
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED';
  amount?: number;
  lastPaymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPaymentInit {
  token: string;
  url: string;
  subscriptionId: string;
}

export interface SubscriptionAnalytics {
  summary: {
    totalActive: number;
    totalCancelled: number;
    totalPaused: number;
    totalExpired: number;
    totalSubscriptions: number;
  };
  planBreakdown: {
    monthly: number;
    quarterly: number;
    annual: number;
  };
  revenue: {
    mrr: number;
    arr: number;
    currency: string;
  };
  recentSubscriptions: Array<Subscription & {
    user: {
      email: string;
      profile: {
        firstName: string;
        lastName: string;
      };
    };
  }>;
}

// Get all subscription plans
export async function getSubscriptionPlans() {
  const response = await api.get<{ plans: SubscriptionPlan[] }>('/subscriptions/plans');
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch subscription plans');
  }
  return response.data;
}

// Get user's current subscription
export async function getUserSubscription() {
  const response = await api.get<{ subscription: Subscription | null }>('/subscriptions/my-subscription');
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch subscription');
  }
  return response.data;
}

// Create a new subscription (pending payment)
export async function createSubscription(planId: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL') {
  const response = await api.post<{ subscription: Subscription; requiresPayment: boolean; amount: number }>('/subscriptions', { planId });
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to create subscription');
  }
  return response.data;
}

// Initialize Webpay payment for subscription
export async function initSubscriptionPayment(subscriptionId: string) {
  const response = await api.post<SubscriptionPaymentInit>('/subscriptions/payment/init', { subscriptionId });
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to initialize payment');
  }
  return response.data;
}

// Get subscription payment status
export async function getSubscriptionPaymentStatus(subscriptionId: string) {
  const response = await api.get<{
    subscriptionId: string;
    planId: string;
    status: string;
    paymentStatus: string;
    amount: number;
    startedAt: string | null;
    expiresAt: string | null;
  }>(`/subscriptions/payment/status/${subscriptionId}`);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to get payment status');
  }
  return response.data;
}

// Update subscription
export async function updateSubscription(
  subscriptionId: string,
  data: { autoRenew?: boolean; newPlanId?: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' }
) {
  const response = await api.put<{ subscription: Subscription }>(
    `/subscriptions/${subscriptionId}`,
    data
  );
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to update subscription');
  }
  return response.data;
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  const response = await api.post<{ subscription: Subscription }>(
    `/subscriptions/${subscriptionId}/cancel`,
    {}
  );
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to cancel subscription');
  }
  return response.data;
}

// Pause subscription
export async function pauseSubscription(subscriptionId: string) {
  const response = await api.post<{ subscription: Subscription }>(
    `/subscriptions/${subscriptionId}/pause`,
    {}
  );
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to pause subscription');
  }
  return response.data;
}

// Resume subscription
export async function resumeSubscription(subscriptionId: string) {
  const response = await api.post<{ subscription: Subscription }>(
    `/subscriptions/${subscriptionId}/resume`,
    {}
  );
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to resume subscription');
  }
  return response.data;
}

// Admin: Get all subscriptions
export async function getAllSubscriptions(page = 1, limit = 20, status?: string) {
  let url = `/subscriptions/admin/all?page=${page}&limit=${limit}`;
  if (status) url += `&status=${status}`;

  const response = await api.get<{ subscriptions: Subscription[]; pagination: any }>(url);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch subscriptions');
  }
  return response.data;
}

// Admin: Get subscription analytics
export async function getSubscriptionAnalytics() {
  const response = await api.get<SubscriptionAnalytics>('/subscriptions/admin/analytics');
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch subscription analytics');
  }
  return response.data;
}

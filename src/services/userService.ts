/**
 * User Service
 * Handles user management (admin only)
 */

import api from '@/lib/api';

export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  firstName: string;
  lastName: string;
  phone: string;
  customerType: 'INDIVIDUAL' | 'BUSINESS';
  taxId: string;
  preferredLanguage: string;
  ordersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalUsers: number;
  adminCount: number;
  regularUsersCount: number;
  usersByType: Record<string, number>;
  newUsersThisMonth: number;
}

/**
 * Get all users (admin)
 */
export async function getAllUsers(page = 1, limit = 50, role?: string, search?: string) {
  let url = `/users/admin/all?page=${page}&limit=${limit}`;
  if (role) url += `&role=${role}`;
  if (search) url += `&search=${search}`;

  const response = await api.get<{ users: User[]; pagination: any }>(url);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch users');
  }
  return response.data;
}

/**
 * Get user by ID (admin)
 */
export async function getUserById(userId: string) {
  const response = await api.get<{ user: any }>(`/users/admin/${userId}`);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch user');
  }
  return response.data;
}

/**
 * Update user role (admin)
 */
export async function updateUserRole(userId: string, role: 'USER' | 'ADMIN') {
  const response = await api.put<{ message: string; role: string }>(`/users/admin/${userId}/role`, { role });
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to update user role');
  }
  return response.data;
}

/**
 * Get user statistics (admin)
 */
export async function getUserStats() {
  const response = await api.get<UserStats>('/users/admin/stats');
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch user statistics');
  }
  return response.data;
}

export interface CreateUserData {
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
  firstName?: string;
  lastName?: string;
  phone?: string;
  customerType?: 'INDIVIDUAL' | 'BUSINESS';
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  customerType?: 'INDIVIDUAL' | 'BUSINESS';
  taxId?: string;
}

/**
 * Create new user (admin)
 */
export async function createUser(userData: CreateUserData) {
  const response = await api.post<{ user: User }>('/users/admin/create', userData);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to create user');
  }
  return response.data;
}

/**
 * Update user (admin)
 */
export async function updateUser(userId: string, userData: UpdateUserData) {
  const response = await api.put<{ user: User }>(`/users/admin/${userId}`, userData);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to update user');
  }
  return response.data;
}

/**
 * Delete user (admin)
 */
export async function deleteUser(userId: string) {
  const response = await api.delete<{ message: string; deletedUser: { id: string; email: string } }>(`/users/admin/${userId}`);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to delete user');
  }
  return response.data;
}

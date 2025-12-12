/**
 * Authentication Service
 * Handles user authentication, registration, and profile management
 */

import api, { setAuthToken, removeAuthToken } from '@/lib/api';
import type { User, Profile, Address } from '@/types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  customerType?: 'INDIVIDUAL' | 'BUSINESS';
  taxId?: string;
  businessName?: string;
  businessTaxId?: string;
  preferredLanguage?: 'ES' | 'EN' | 'FR' | 'DE' | 'PT' | 'ZH' | 'HI';
}

export interface AddressCreateRequest {
  type: 'SHIPPING' | 'BILLING';
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  address?: string; // Full address string
}

/**
 * Login user
 */
export async function login(credentials: LoginRequest) {
  const response = await api.post<LoginResponse>('/auth/login', credentials);

  if (response.success && response.data) {
    setAuthToken(response.data.token);
  }

  return response;
}

/**
 * Register new user
 */
export async function register(userData: RegisterRequest) {
  const response = await api.post<LoginResponse>('/auth/register', userData);

  if (response.success && response.data) {
    setAuthToken(response.data.token);
  }

  return response;
}

/**
 * Logout user
 */
export async function logout() {
  removeAuthToken();
  // Could call backend logout endpoint if needed
  return { success: true };
}

/**
 * Get current user profile
 */
export async function getProfile() {
  return api.get<{ user: User; profile: Profile }>('/profile');
}

/**
 * Update user profile
 */
export async function updateProfile(data: ProfileUpdateRequest) {
  return api.put<{ profile: Profile }>('/profile', data);
}

/**
 * Get user addresses
 */
export async function getAddresses() {
  return api.get<{ addresses: Address[] }>('/profile/addresses');
}

/**
 * Create new address
 */
export async function createAddress(data: AddressCreateRequest) {
  return api.post<{ address: Address }>('/profile/addresses', data);
}

/**
 * Update address
 */
export async function updateAddress(addressId: string, data: Partial<AddressCreateRequest>) {
  return api.put<{ address: Address }>(`/profile/addresses/${addressId}`, data);
}

/**
 * Delete address
 */
export async function deleteAddress(addressId: string) {
  return api.delete(`/profile/addresses/${addressId}`);
}

/**
 * Set default address
 */
export async function setDefaultAddress(addressId: string) {
  return api.put<{ address: Address }>(`/profile/addresses/${addressId}/default`, {});
}

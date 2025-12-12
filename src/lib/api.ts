/**
 * API Client for V&M Candle Backend
 * Base URL and HTTP client configuration
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

/**
 * Get authentication token from localStorage
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

/**
 * Set authentication token in localStorage
 */
export function setAuthToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

/**
 * Remove authentication token from localStorage
 */
export function removeAuthToken(): void {
  localStorage.removeItem('auth_token');
}

/**
 * Base fetch wrapper with authentication and error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add authentication token if available
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log(`🌐 API Call: ${options.method || 'GET'} ${endpoint}`, {
    hasToken: !!token,
    url
  });

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ API Error: ${options.method || 'GET'} ${endpoint}`, {
        status: response.status,
        error: data.error
      });
      return {
        success: false,
        error: data.error || {
          code: 'UNKNOWN_ERROR',
          message: 'An unknown error occurred',
        },
      };
    }

    console.log(`✅ API Success: ${options.method || 'GET'} ${endpoint}`);
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network request failed',
      },
    };
  }
}

/**
 * HTTP Methods
 */
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default api;

/**
 * Upload Service
 * Handles file upload operations
 */

import { getAuthToken } from '@/lib/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface UploadImageResponse {
  success: boolean;
  filePath: string;
  fileName: string;
  originalName: string;
  size: number;
}

/**
 * Upload a product image
 */
export async function uploadProductImage(file: File): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append('image', file);

  const token = getAuthToken();
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Don't set Content-Type - let the browser set it with the boundary parameter
  const response = await fetch(`${API_BASE_URL}/upload/product-image`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Upload failed');
  }

  const data = await response.json();
  return data;
}

import api from '@/lib/api';

// Backend base URL for static assets (audio files)
const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

export type AudioCategory = 'AMBIENT' | 'MEDITATION';

export interface AudioContent {
  id: string;
  titleKey: string;
  category: AudioCategory;
  fileUrl: string | null;
  durationSeconds: number;
  isPreview: boolean;
  requiredPlan: string | null;
  sortOrder: number;
  canAccess?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AudioLibrary {
  hasSubscription: boolean;
  hasAccessKey: boolean;
  planId: string | null;
  expiresAt: string | null;
  library: AudioContent[];
}

export interface AudioAccessKey {
  id: string;
  keyCode: string;
  planId: string;
  durationMonths: number;
  isRedeemed: boolean;
  redeemedAt: string | null;
  expiresAt: string | null;
  redeemedBy?: {
    id: string;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
    };
  };
  createdAt: string;
}

// Get all audio content (public metadata)
export async function getAudioContent(params?: {
  category?: AudioCategory;
  isPreview?: boolean;
  page?: number;
  limit?: number;
}) {
  let url = '/audio';
  const queryParams = new URLSearchParams();

  if (params?.category) queryParams.append('category', params.category);
  if (params?.isPreview !== undefined) queryParams.append('isPreview', String(params.isPreview));
  if (params?.page) queryParams.append('page', String(params.page));
  if (params?.limit) queryParams.append('limit', String(params.limit));

  const queryString = queryParams.toString();
  if (queryString) url += `?${queryString}`;

  const response = await api.get<{ audioContent: AudioContent[]; pagination: any }>(url);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch audio content');
  }
  return response.data;
}

// Get single audio content by ID
export async function getAudioById(id: string) {
  const response = await api.get<{ audio: AudioContent }>(`/audio/${id}`);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch audio');
  }
  return response.data;
}

// Get user's audio library with access info
export async function getMyAudioLibrary() {
  const response = await api.get<AudioLibrary>('/audio/user/my-library');
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch audio library');
  }
  return response.data;
}

// Get stream URL for audio (with access check)
export async function getAudioStreamUrl(id: string) {
  const response = await api.get<{ streamUrl: string; audio: AudioContent }>(`/audio/${id}/stream`);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to get stream URL');
  }

  let streamUrl = response.data.streamUrl;

  // If it's already an absolute URL, use it as-is
  if (!streamUrl.startsWith('http')) {
    // Transform /uploads/audio/... to /audio/... to match nginx config
    if (streamUrl.startsWith('/uploads/audio/')) {
      streamUrl = streamUrl.replace('/uploads/audio/', '/audio/');
    }
    // Prepend backend URL
    streamUrl = `${BACKEND_URL}${streamUrl}`;
  }

  return { ...response.data, streamUrl };
}

// Redeem an access key
export async function redeemAccessKey(keyCode: string) {
  const response = await api.post<{
    message: string;
    planId: string;
    expiresAt: string;
    durationMonths: number;
  }>('/audio/redeem-key', { keyCode });
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to redeem access key');
  }
  return response.data;
}

// ============ ADMIN FUNCTIONS ============

// Create audio content (Admin)
export async function createAudioContent(data: {
  titleKey: string;
  category: AudioCategory;
  fileUrl: string;
  durationSeconds: number;
  isPreview?: boolean;
  requiredPlan?: string | null;
  sortOrder?: number;
}) {
  const response = await api.post<{ audio: AudioContent }>('/audio/admin', data);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to create audio content');
  }
  return response.data;
}

// Update audio content (Admin)
export async function updateAudioContent(
  id: string,
  data: Partial<{
    titleKey: string;
    category: AudioCategory;
    fileUrl: string;
    durationSeconds: number;
    isPreview: boolean;
    requiredPlan: string | null;
    sortOrder: number;
  }>
) {
  const response = await api.put<{ audio: AudioContent }>(`/audio/admin/${id}`, data);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to update audio content');
  }
  return response.data;
}

// Delete audio content (Admin)
export async function deleteAudioContent(id: string) {
  const response = await api.delete<{ message: string }>(`/audio/admin/${id}`);
  if (!response.success) {
    throw new Error(response.error?.message || 'Failed to delete audio content');
  }
  return response.data;
}

// Generate access keys (Admin)
export async function generateAccessKeys(data: {
  planId: string;
  durationMonths: number;
  count?: number;
}) {
  const response = await api.post<{ keys: AudioAccessKey[] }>('/audio/admin/generate-keys', data);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to generate access keys');
  }
  return response.data;
}

// Get all access keys (Admin)
export async function getAllAccessKeys(params?: {
  page?: number;
  limit?: number;
  redeemed?: boolean;
}) {
  let url = '/audio/admin/keys';
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', String(params.page));
  if (params?.limit) queryParams.append('limit', String(params.limit));
  if (params?.redeemed !== undefined) queryParams.append('redeemed', String(params.redeemed));

  const queryString = queryParams.toString();
  if (queryString) url += `?${queryString}`;

  const response = await api.get<{ keys: AudioAccessKey[]; pagination: any }>(url);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch access keys');
  }
  return response.data;
}

// Helper function to format duration
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Audio title translations
export const audioTitles: Record<string, { en: string; es: string }> = {
  deepCalm: { en: 'Deep Calm', es: 'Calma Profunda' },
  spiritualConnection: { en: 'Spiritual Connection', es: 'Conexión Espiritual' },
  emotionalBalance: { en: 'Emotional Balance', es: 'Equilibrio Emocional' },
  morningSerenity: { en: 'Morning Serenity', es: 'Serenidad Matutina' },
  eveningRelaxation: { en: 'Evening Relaxation', es: 'Relajación Vespertina' },
  forestRain: { en: 'Forest Rain', es: 'Lluvia en el Bosque' },
  oceanWaves: { en: 'Ocean Waves', es: 'Olas del Océano' },
  guidedBreathing: { en: 'Guided Breathing', es: 'Respiración Guiada' },
  bodyRelaxation: { en: 'Body Relaxation', es: 'Relajación Corporal' },
  innerPeace: { en: 'Inner Peace', es: 'Paz Interior' },
  sleepMeditation: { en: 'Sleep Meditation', es: 'Meditación para Dormir' },
  healingFrequency432: { en: 'Healing Frequency 432Hz', es: 'Frecuencia Sanadora 432Hz' },
  chakraBalance: { en: 'Chakra Balance', es: 'Equilibrio de Chakras' },
  tibetanBowls: { en: 'Tibetan Bowls', es: 'Cuencos Tibetanos' },
  binauralBeats: { en: 'Binaural Beats', es: 'Ritmos Binaurales' },
  exclusiveMasterclass: { en: 'Exclusive Masterclass', es: 'Masterclass Exclusiva' },
  premiumRetreat: { en: 'Premium Retreat', es: 'Retiro Premium' },
  seasonalCollection: { en: 'Seasonal Collection', es: 'Colección de Temporada' },
  liveSessionRecording: { en: 'Live Session Recording', es: 'Grabación de Sesión en Vivo' },
};

// Category translations
export const categoryLabels: Record<AudioCategory, { en: string; es: string }> = {
  AMBIENT: { en: 'Ambient', es: 'Ambiente' },
  MEDITATION: { en: 'Meditation', es: 'Meditación' },
};

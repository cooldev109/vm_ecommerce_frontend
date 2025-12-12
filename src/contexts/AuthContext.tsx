/**
 * Authentication Context
 * Manages user authentication state and provides auth methods
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, Profile } from '@/types';
import * as authService from '@/services/authService';
import { removeAuthToken } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (data: authService.RegisterRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      // FIRST: Decode token and set minimal user immediately
      // This ensures user stays logged in even if profile fetch fails
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.userId && payload.role) {
          const minimalUser = {
            id: payload.userId,
            email: payload.email || '',
            role: payload.role,
          };
          setUser(minimalUser as any);
        }
      } catch (decodeError) {
        console.error('Failed to decode token:', decodeError);
        removeAuthToken();
        setIsLoading(false);
        return;
      }

      // SECOND: Try to load full profile from backend
      try {
        const response = await authService.getProfile();

        if (response.success && response.data) {
          // Update with full user data
          setUser(response.data.user);
          setProfile(response.data.profile);
        } else if (response.error?.code === 'UNAUTHORIZED' || response.error?.code === 'INVALID_TOKEN') {
          // Token is invalid, clear everything
          removeAuthToken();
          setUser(null);
          setProfile(null);
        }
        // For other errors, keep the minimal user from token
      } catch (error) {
        // Network error or other issue - keep the minimal user from token
        console.warn('Failed to load profile, keeping minimal user from token:', error);
      }

      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });

      if (response.success && response.data) {
        setUser(response.data.user);
        setProfile(response.data.user.profile || null);
        return { success: true, user: response.data.user };
      }

      return {
        success: false,
        error: response.error?.message || 'Login failed',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  };

  const register = async (data: authService.RegisterRequest) => {
    try {
      const response = await authService.register(data);

      if (response.success && response.data) {
        setUser(response.data.user);
        setProfile(response.data.user.profile || null);
        return { success: true };
      }

      // Get detailed error message from validation errors if available
      let errorMessage = response.error?.message || 'Registration failed';
      if (response.error?.details && Array.isArray(response.error.details)) {
        errorMessage = response.error.details.map((d: any) => d.message).join(', ');
      }

      return {
        success: false,
        error: errorMessage,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    authService.logout();
  };

  const refreshProfile = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success && response.data) {
        setUser(response.data.user);
        setProfile(response.data.profile);
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

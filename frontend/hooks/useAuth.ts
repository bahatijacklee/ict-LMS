/**
 * useAuth Hook
 * Login, logout, and authentication state management
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
  saveTokens,
  clearTokens,
  getAccessToken,
  getUserRole,
  decodeToken,
  isAuthenticated as checkAuth,
} from '@/lib/auth';
import { ROLE_DASHBOARDS } from '@/lib/constants';
import type { User, AuthTokens, AuthState } from '@/types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

/**
 * Hook for authentication operations
 */
export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    tokens: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
  });

  /**
   * Initialize auth state from localStorage
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = getAccessToken();

    if (token && checkAuth()) {
      const decoded = decodeToken(token);

      if (decoded) {
        setState((prev) => ({
          ...prev,
          isAuthenticated: true,
        }));
      }
    }
  }, []);

  /**
   * Login with email and password
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const response = await api.post<AuthResponse>('/auth/login/', credentials);

        const { access, refresh, user } = response.data;

        // Save tokens and user
        saveTokens({ access, refresh }, user);

        // Update state
        setState({
          user,
          tokens: { access, refresh },
          isLoading: false,
          error: null,
          isAuthenticated: true,
        });

        // Redirect to role-based dashboard
        const dashboard = ROLE_DASHBOARDS[user.role] || '/student/dashboard';
        router.push(dashboard);

        return { success: true, user };
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.detail ||
          'Login failed. Please try again.';

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        return { success: false, error: errorMessage };
      }
    },
    [router]
  );

  /**
   * Logout and clear all auth data
   */
  const logout = useCallback(() => {
    clearTokens();
    setState({
      user: null,
      tokens: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
    });

    router.push('/login');
  }, [router]);

  /**
   * Check current authentication status
   */
  const isAuthenticated = useCallback(() => {
    return checkAuth();
  }, []);

  /**
   * Get current user role
   */
  const getRole = useCallback(() => {
    return getUserRole();
  }, []);

  return {
    // State
    user: state.user,
    tokens: state.tokens,
    isLoading: state.isLoading,
    error: state.error,
    isAuthenticated: state.isAuthenticated,

    // Methods
    login,
    logout,
    isAuthenticated,
    getRole,
  };
}

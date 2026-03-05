/**
 * Authentication Utilities
 * Token management, decoding, and validation
 */

import { jwtDecode } from 'jwt-decode';
import { TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from './constants';
import type { DecodedToken, AuthTokens, User } from '@/types';

/**
 * Save tokens to localStorage and user to state
 */
export function saveTokens(tokens: AuthTokens, user?: User): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(TOKEN_KEY, tokens.access);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

/**
 * Clear all auth data from localStorage
 */
export function clearTokens(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Get current access token
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get current refresh token
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Decode JWT token (doesn't validate signature, only reads payload)
 */
export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);

  if (!decoded) {
    return true;
  }

  // Check if expiry time is in the past (with 1 minute buffer)
  const expiryTime = decoded.exp * 1000; // Convert to milliseconds
  const bufferTime = 60000; // 1 minute buffer

  return Date.now() > expiryTime - bufferTime;
}

/**
 * Get current valid token (refresh if needed)
 * Note: Actual refresh happens via Axios interceptor
 */
export function getCurrentToken(): string | null {
  if (typeof window === 'undefined') return null;

  const token = getAccessToken();

  if (!token) {
    return null;
  }

  // If token is expired, return null (Axios will handle refresh)
  if (isTokenExpired(token)) {
    return null;
  }

  return token;
}

/**
 * Get stored user from localStorage
 */
export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;

  try {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Failed to parse stored user:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;

  const token = getAccessToken();

  if (!token) {
    return false;
  }

  return !isTokenExpired(token);
}

/**
 * Get user role from token
 */
export function getUserRole(): string | null {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  const decoded = decodeToken(token);

  return decoded?.role || null;
}

/**
 * Check if user has a specific role
 */
export function hasRole(role: string): boolean {
  const userRole = getUserRole();
  return userRole === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(roles: string[]): boolean {
  const userRole = getUserRole();
  return userRole ? roles.includes(userRole) : false;
}

/**
 * Format token error message
 */
export function getTokenErrorMessage(error: any): string {
  if (error.response?.status === 401) {
    return 'Your session has expired. Please log in again.';
  }

  if (error.message === 'Network Error') {
    return 'Connection failed. Check your internet and try again.';
  }

  return 'An error occurred. Please try again.';
}

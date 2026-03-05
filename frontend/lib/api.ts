/**
 * Axios API Client with JWT Interceptor
 * 
 * This is the central nervous system connecting Next.js to Django.
 * Every request automatically includes the JWT token and handles token refresh.
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { TOKEN_KEY, REFRESH_TOKEN_KEY, API_BASE_URL, HTTP_STATUS } from './constants';

// Create base Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * REQUEST INTERCEPTOR
 * Fires BEFORE the request leaves Next.js
 * Injects JWT token into Authorization header
 */
api.interceptors.request.use(
  (config) => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return config;
    }

    // Get token from localStorage
    const token = localStorage.getItem(TOKEN_KEY);

    // If we have a token, inject it into the Authorization header
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Fires AFTER Django responds, but before your UI sees it
 * Handles token refresh on 401 Unauthorized
 */
api.interceptors.response.use(
  (response) => {
    // If success, pass it through
    return response;
  },
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // If we got a 401 Unauthorized and haven't retried yet
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get refresh token from localStorage
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

        if (!refreshToken) {
          // No refresh token available, force logout
          throw new Error('No refresh token available');
        }

        // Call Django refresh endpoint
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        // Save new access token
        const newAccessToken = refreshResponse.data.access;
        localStorage.setItem(TOKEN_KEY, newAccessToken);

        // Update the failed request with new token and retry
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, force user to log in
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);

        if (typeof window !== 'undefined') {
          // Redirect to login
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    // For any other error, pass to UI
    return Promise.reject(error);
  }
);

export default api;

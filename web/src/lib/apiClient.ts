import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    } catch (error) {
      console.error('Error getting session:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
 async (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 401:
          const session = await getSession();

          // Unauthorized - redirect to login or refresh token
          if (typeof window !== 'undefined') {
            // Only redirect on client side
            console.error('Unauthorized access - redirecting to login.');
            console.log('the bearer token is invalid or expired  ' + session?.accessToken);
            // window.location.href = '/login';
          }
          break;
        case 403:
          console.error('Access forbidden:', data?.message || 'Forbidden');
          break;
        case 404:
          console.error('Resource not found:', data?.message || 'Not found');
          break;
        case 500:
          console.error('Server error:', data?.message || 'Internal server error');
          break;
        default:
          console.error('API error:', data?.message || error.message);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('No response from server:', error.message);
    } else {
      // Error setting up request
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Generic request wrapper with error handling
export async function apiRequest<T>(
  config: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// HTTP method helpers
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'GET', url }),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'POST', url, data }),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'PUT', url, data }),

  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'PATCH', url, data }),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'DELETE', url }),
};

export default apiClient;

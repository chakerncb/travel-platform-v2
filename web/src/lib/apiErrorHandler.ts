import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  errors?: { [key: string]: string[] };
  statusCode?: number;
}

/**
 * Extract error message from API error response
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response?.data) {
      const data = error.response.data;
      
      // Handle validation errors
      if (data.errors && typeof data.errors === 'object') {
        const firstError = Object.values(data.errors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          return firstError[0];
        }
      }
      
      // Handle simple message
      if (data.message) {
        return data.message;
      }
      
      // Handle error string
      if (data.error) {
        return data.error;
      }
      
      // Handle title
      if (data.title) {
        return data.title;
      }
    }
    
    // Handle network errors
    if (error.message) {
      return error.message;
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

/**
 * Extract all validation errors from API response
 */
export function getValidationErrors(error: unknown): { [key: string]: string[] } | null {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    if (data?.errors && typeof data.errors === 'object') {
      return data.errors;
    }
  }
  return null;
}

/**
 * Check if error is a specific HTTP status
 */
export function isHttpError(error: unknown, statusCode: number): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === statusCode;
  }
  return false;
}

/**
 * Check if error is unauthorized (401)
 */
export function isUnauthorized(error: unknown): boolean {
  return isHttpError(error, 401);
}

/**
 * Check if error is forbidden (403)
 */
export function isForbidden(error: unknown): boolean {
  return isHttpError(error, 403);
}

/**
 * Check if error is not found (404)
 */
export function isNotFound(error: unknown): boolean {
  return isHttpError(error, 404);
}

/**
 * Check if error is validation error (400)
 */
export function isValidationError(error: unknown): boolean {
  return isHttpError(error, 400);
}

/**
 * Check if error is server error (500+)
 */
export function isServerError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    return status ? status >= 500 : false;
  }
  return false;
}

/**
 * Format error for display
 */
export function formatApiError(error: unknown): ApiError {
  const message = getErrorMessage(error);
  const errors = getValidationErrors(error);
  const statusCode = error instanceof AxiosError ? error.response?.status : undefined;
  
  return {
    message,
    errors: errors || undefined,
    statusCode,
  };
}

/**
 * Handle API error with common patterns
 */
export function handleApiError(
  error: unknown,
  options?: {
    onUnauthorized?: () => void;
    onForbidden?: () => void;
    onNotFound?: () => void;
    onValidationError?: (errors: { [key: string]: string[] }) => void;
    onServerError?: () => void;
    defaultHandler?: (message: string) => void;
  }
): void {
  if (isUnauthorized(error)) {
    options?.onUnauthorized?.();
    return;
  }
  
  if (isForbidden(error)) {
    options?.onForbidden?.();
    return;
  }
  
  if (isNotFound(error)) {
    options?.onNotFound?.();
    return;
  }
  
  if (isValidationError(error)) {
    const errors = getValidationErrors(error);
    if (errors) {
      options?.onValidationError?.(errors);
      return;
    }
  }
  
  if (isServerError(error)) {
    options?.onServerError?.();
    return;
  }
  
  const message = getErrorMessage(error);
  options?.defaultHandler?.(message);
}

/**
 * Retry failed request with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: unknown;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry client errors (4xx) except 429 (rate limit)
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status && status >= 400 && status < 500 && status !== 429) {
          throw error;
        }
      }
      
      // Wait before retrying with exponential backoff
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

/**
 * API Configuration and Constants
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  STORAGE_URL: process.env.NEXT_PUBLIC_STORAGE_URL || 'http://localhost:8000/storage',
  TIMEOUT: 30000, // 30 seconds
} as const;

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    PROFILE: '/profile',
    CONFIRM_EMAIL: (id: string, hash: string) => `/email/verify/${id}/${hash}`,
    RESEND_CONFIRMATION: '/email/resend',
  },
  
  // Destinations
  DESTINATIONS: {
    BASE: '/v1/destinations',
    BY_ID: (id: string) => `/v1/destinations/${id}`,
  },
  
  // Hotels
  HOTELS: {
    BASE: '/v1/hotels',
    BY_ID: (id: string) => `/v1/hotels/${id}`,
  },
  
  // Tours
  TOURS: {
    BASE: '/v1/tours',
    BY_ID: (id: string) => `/v1/tours/${id}`,
    MY_CUSTOM: '/v1/tours/my-custom-tours',
    CUSTOM_REQUEST: '/tour/custom-request',
    PUBLISH: (id: string) => `/tour/${id}/publish`,
    ARCHIVE: (id: string) => `/tour/${id}/archive`,
  },
  
  // Travel Agencies
  AGENCIES: {
    BASE: '/travelagency',
    BY_ID: (id: string) => `/travelagency/${id}`,
    BY_SLUG: (slug: string) => `/travelagency/slug/${slug}`,
    BY_USER: (userId: string) => `/travelagency/user/${userId}`,
  },
  
  // Images
  IMAGES: {
    UPLOAD: '/images/upload',
    UPLOAD_MULTIPLE: '/images/upload-multiple',
    BY_ID: (id: string) => `/images/${id}`,
    BY_ENTITY: (entityType: string, entityId: string) => `/images/${entityType}/${entityId}`,
    UPDATE_ORDER: (id: string) => `/images/${id}/order`,
    UPDATE_METADATA: (id: string) => `/images/${id}/metadata`,
  },
  
  // Admin
  ADMIN: {
    DESTINATIONS: '/admin/destinations',
    DESTINATION_BY_ID: (id: string) => `/admin/destinations/${id}`,
    HOTELS: '/admin/hotels',
    HOTEL_BY_ID: (id: string) => `/admin/hotels/${id}`,
    HOTEL_TOGGLE_ACTIVE: (id: string) => `/admin/hotels/${id}/toggle-active`,
    TOURS: '/admin/tours',
    TOUR_BY_ID: (id: string) => `/admin/tours/${id}`,
    TOUR_APPROVE: (id: string) => `/admin/tours/${id}/approve`,
    TOUR_REJECT: (id: string) => `/admin/tours/${id}/reject`,
    AGENCIES: '/admin/travelagencies',
    AGENCY_VERIFY: (id: string) => `/admin/travelagencies/${id}/verify`,
    AGENCY_UNVERIFY: (id: string) => `/admin/travelagencies/${id}/unverify`,
    AGENCY_TOGGLE_ACTIVE: (id: string) => `/admin/travelagencies/${id}/toggle-active`,
  },
} as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Request Headers
 */
export const REQUEST_HEADERS = {
  JSON: {
    'Content-Type': 'application/json',
  },
  FORM_DATA: {
    'Content-Type': 'multipart/form-data',
  },
} as const;

/**
 * Query Parameter Defaults
 */
export const QUERY_DEFAULTS = {
  PAGE_SIZE: 20,
  PAGE_NUMBER: 1,
  SORT_ORDER: 'desc' as const,
} as const;

/**
 * Cache Duration (in seconds)
 */
export const CACHE_DURATION = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;

/**
 * Validation Constants
 */
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 100,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
  SLUG_REGEX: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TIMEOUT: 'Request timeout. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful! Please check your email to confirm.',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  CREATED: 'Created successfully!',
  UPDATED: 'Updated successfully!',
  DELETED: 'Deleted successfully!',
  UPLOADED: 'Uploaded successfully!',
} as const;

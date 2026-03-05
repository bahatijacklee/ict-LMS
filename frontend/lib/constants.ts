/**
 * Application Constants
 */

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
export const API_TIMEOUT = 30000; // 30 seconds

// LocalStorage Keys
export const TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const USER_KEY = 'user';

// Routes
export const PUBLIC_ROUTES = ['/'];
export const AUTH_ROUTES = ['/(auth)/login'];
export const PROTECTED_ROUTES = ['/(dashboards)'];

// User Roles
export const ROLES = {
  STUDENT: 'STUDENT',
  INSTRUCTOR: 'INSTRUCTOR',
  FINANCE: 'FINANCE',
  IT_ADMIN: 'IT_ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

// Role-based Dashboard Routes
export const ROLE_DASHBOARDS: Record<string, string> = {
  STUDENT: '/student/dashboard',
  INSTRUCTOR: '/instructor/dashboard',
  FINANCE: '/finance/dashboard',
  IT_ADMIN: '/admin/dashboard',
  SUPER_ADMIN: '/admin/dashboard',
};

// Pagination
export const ITEMS_PER_PAGE = {
  SMALL: 10,
  MEDIUM: 20,
  LARGE: 50,
};

// Validation Rules
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^(\+254|0)[1-9]\d{8}$/;
export const MIN_PASSWORD_LENGTH = 8;

// Payment Methods
export const PAYMENT_METHODS = [
  { value: 'MPESA', label: 'M-Pesa' },
  { value: 'BANK', label: 'Bank Transfer' },
  { value: 'CASH', label: 'Cash' },
  { value: 'CHEQUE', label: 'Cheque' },
];

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Connection failed. Check your internet and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Unauthorized access. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  PASSWORD_TOO_SHORT: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
  FORM_VALIDATION_ERROR: 'Please check the form and try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Logged in successfully!',
  PAYMENT_SUCCESS: 'Payment processed successfully!',
  ATTENDANCE_SAVED: 'Attendance saved successfully!',
  GRADES_SAVED: 'Grades saved successfully!',
  USER_CREATED: 'User created successfully!',
  UPDATE_SUCCESS: 'Updated successfully!',
};

// Notification Settings
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 4000,
  LONG: 6000,
  STICKY: 0, // User must close manually
};

/**
 * User & Role Types
 */

export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'FINANCE' | 'IT_ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  role: UserRole;
  is_active: boolean;
  date_joined: string;
  last_login?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface DecodedToken {
  user_id: string;
  email: string;
  role: UserRole;
  exp: number;
  iat: number;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

/**
 * Course & Enrollment Types
 */

export interface Course {
  id: string;
  course_code: string;
  name: string;
  description?: string;
  fee: number;
  duration_weeks?: number;
  level?: string;
  created_at: string;
  updated_at: string;
}

export interface Batch {
  id: string;
  name: string;
  course: string | Course;
  instructor?: string | User;
  start_date: string;
  end_date: string;
  max_students: number;
  current_students: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'SUSPENDED' | 'DROPPED';

export interface Enrollment {
  id: string;
  student: string | User;
  batch: string | Batch;
  course: Course;
  status: EnrollmentStatus;
  agreed_fee: number;
  balance: number;
  progress: number;
  attendance_percentage: number | null;
  current_grade: string | null;
  enrolled_date: string;
  completion_date?: string | null;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Payment Types
 */

export type PaymentMethod = 'CASH' | 'BANK' | 'M_PESA' | 'CHEQUE';
export type PaymentStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface Payment {
  id: string;
  enrollment: Enrollment;
  amount_paid: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_ref?: string;
  payment_date: string;
  verified_at?: string | null;
  verified_by?: string | User | null;
  receipt_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Attendance Types
 */

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface AttendanceRecord {
  id: string;
  enrollment: Enrollment;
  date: string;
  status: AttendanceStatus;
  remark: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Grade Types
 */

export interface GradeEntry {
  id: string;
  enrollment: Enrollment;
  assignment_1?: number;
  assignment_2?: number;
  midterm?: number;
  final_project?: number;
  participation?: number;
  final_grade?: string; // A, B, C, etc.
  comments?: string;
  created_at: string;
  updated_at: string;
}

/**
 * API Response Types
 */

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * UI Component Props Types
 */

export interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
}

export interface FormFieldProps {
  label: string;
  value?: string | number;
  error?: string;
  required?: boolean;
  [key: string]: any;
}

export interface ToastNotification {
  id: string;
  title: string;
  description?: string;
  status: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Dashboard Metrics Types
 */

export interface StudentMetrics {
  active_courses: number;
  total_fees: number;
  fees_paid: number;
  fees_overdue: number;
  attendance_percentage: number;
  gpa?: number;
}

export interface InstructorMetrics {
  active_batches: number;
  total_students: number;
  pending_grades: number;
  average_attendance_rate: number;
}

export interface FinanceMetrics {
  total_revenue: number;
  today_revenue: number;
  pending_payments: number;
  overdue_payments: number;
  overdue_amount: number;
}

export interface AdminMetrics {
  total_users: number;
  active_users: number;
  total_revenue: number;
  error_rate: number;
  api_health: 'healthy' | 'degraded' | 'down';
}

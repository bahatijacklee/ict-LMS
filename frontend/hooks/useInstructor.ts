/**
 * Instructor-specific hooks
 * Fetch courses taught by instructor
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Enrollment, AttendanceRecord, PaginatedResponse, ApiResponse } from '@/types';

// Get courses taught by current instructor
export function useMyTeachingCourses() {
  return useQuery({
    queryKey: ['instructor-courses'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<any[]>>('/courses/my-teaching-courses/');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

// Get enrollments for a specific course/batch
export function useCourseEnrollments(batchId: string) {
  return useQuery({
    queryKey: ['batch-enrollments', batchId],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Enrollment>>(
        `/enrollments/?batch=${batchId}&page_size=100`
      );
      return response.data.results;
    },
    enabled: !!batchId,
    staleTime: 1000 * 60 * 2,
  });
}

// Mark attendance for students
interface AttendanceData {
  enrollment: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AttendanceData) => {
      const response = await api.post<ApiResponse<AttendanceRecord>>('/attendance/', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['batch-enrollments'] });
    },
  });
}

// Bulk mark attendance
interface BulkAttendanceData {
  batch: string;
  date: string;
  records: Array<{
    enrollment: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
    remarks?: string;
  }>;
}

export function useBulkMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BulkAttendanceData) => {
      const response = await api.post('/attendance/bulk-mark/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['batch-enrollments'] });
    },
  });
}

// Update grade for enrollment
interface GradeData {
  enrollment: string;
  assignment_1?: number;
  assignment_2?: number;
  midterm?: number;
  final_project?: number;
  participation?: number;
  final_grade?: string;
  comments?: string;
}

export function useUpdateGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ enrollmentId, data }: { enrollmentId: string; data: GradeData }) => {
      const response = await api.patch(`/enrollments/${enrollmentId}/update-grade/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batch-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
}

// Get attendance history for a batch
export function useBatchAttendance(batchId: string, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['batch-attendance', batchId, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('batch', batchId);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      params.append('page_size', '500');

      const response = await api.get<PaginatedResponse<AttendanceRecord>>(
        `/attendance/?${params.toString()}`
      );
      return response.data.results;
    },
    enabled: !!batchId,
    staleTime: 1000 * 60 * 2,
  });
}

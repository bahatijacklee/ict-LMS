/**
 * useAttendance Hook
 * Fetch attendance records with React Query
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { AttendanceRecord, PaginatedResponse, ApiResponse } from '@/types';

interface UseAttendanceOptions {
  enrollmentId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export function useAttendance(options: UseAttendanceOptions = {}) {
  const { enrollmentId = '', startDate = '', endDate = '', page = 1, pageSize = 50 } = options;

  return useQuery({
    queryKey: ['attendance', enrollmentId, startDate, endDate, page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (enrollmentId) params.append('enrollment', enrollmentId);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      params.append('page', page.toString());
      params.append('page_size', pageSize.toString());

      const response = await api.get<PaginatedResponse<AttendanceRecord>>(
        `/attendance/?${params.toString()}`
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useMyAttendance() {
  return useQuery({
    queryKey: ['my-attendance'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<AttendanceRecord[]>>('/attendance/my-attendance/');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * useEnrollments Hook
 * Fetch student enrollments with React Query
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Enrollment, PaginatedResponse, ApiResponse } from '@/types';

interface UseEnrollmentsOptions {
  status?: string;
  page?: number;
  pageSize?: number;
}

export function useEnrollments(options: UseEnrollmentsOptions = {}) {
  const { status = '', page = 1, pageSize = 20 } = options;

  return useQuery({
    queryKey: ['enrollments', status, page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      params.append('page', page.toString());
      params.append('page_size', pageSize.toString());

      const response = await api.get<PaginatedResponse<Enrollment>>(
        `/enrollments/?${params.toString()}`
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useEnrollment(id: string) {
  return useQuery({
    queryKey: ['enrollment', id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Enrollment>>(`/enrollments/${id}/`);
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
}

export function useMyEnrollments() {
  return useQuery({
    queryKey: ['my-enrollments'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Enrollment[]>>('/enrollments/my-enrollments/');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 2,
  });
}

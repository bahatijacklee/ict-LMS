/**
 * useCourses Hook
 * Fetch courses data with React Query
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Course, PaginatedResponse, ApiResponse } from '@/types';

interface UseCoursesOptions {
  search?: string;
  level?: string;
  page?: number;
  pageSize?: number;
}

export function useCourses(options: UseCoursesOptions = {}) {
  const { search = '', level = '', page = 1, pageSize = 20 } = options;

  return useQuery({
    queryKey: ['courses', search, level, page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (level) params.append('level', level);
      params.append('page', page.toString());
      params.append('page_size', pageSize.toString());

      const response = await api.get<PaginatedResponse<Course>>(
        `/courses/?${params.toString()}`
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Course>>(`/courses/${id}/`);
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

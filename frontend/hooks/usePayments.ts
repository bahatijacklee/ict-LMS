/**
 * usePayments Hook
 * Fetch payment data with React Query
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Payment, PaginatedResponse, ApiResponse } from '@/types';

interface UsePaymentsOptions {
  enrollmentId?: string;
  page?: number;
  pageSize?: number;
}

export function usePayments(options: UsePaymentsOptions = {}) {
  const { enrollmentId = '', page = 1, pageSize = 20 } = options;

  return useQuery({
    queryKey: ['payments', enrollmentId, page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (enrollmentId) params.append('enrollment', enrollmentId);
      params.append('page', page.toString());
      params.append('page_size', pageSize.toString());

      const response = await api.get<PaginatedResponse<Payment>>(
        `/payments/?${params.toString()}`
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useMyPayments() {
  return useQuery({
    queryKey: ['my-payments'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Payment[]>>('/payments/my-payments/');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 2,
  });
}

interface CreatePaymentData {
  enrollment: string;
  amount: number;
  method: string;
  transaction_ref?: string;
  notes?: string;
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePaymentData) => {
      const response = await api.post<ApiResponse<Payment>>('/payments/', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['my-payments'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
}

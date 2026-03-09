/**
 * Payments List Component
 * Displays student payment history with sorting, filtering, pagination
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Table, type TableColumn } from '@/components/shared/Table';
import { Pagination } from '@/components/shared/Pagination';
import { FilterBar, QuickFilter } from '@/components/shared/FilterBar';
import { useMyPayments } from '@/hooks/usePayments';
import { sortBy, filterBySearch, filterByMultiple, paginate, formatCurrency, formatDisplayDate } from '@/lib/sorting';
import type { Payment, PaymentStatus, PaymentMethod } from '@/types';

const PAYMENT_STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'VERIFIED', label: 'Verified' },
  { value: 'REJECTED', label: 'Rejected' },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: '', label: 'All Methods' },
  { value: 'M_PESA', label: 'M-Pesa' },
  { value: 'BANK', label: 'Bank Transfer' },
  { value: 'CASH', label: 'Cash' },
  { value: 'CHEQUE', label: 'Cheque' },
];

export function PaymentsList() {
  const { data: paymentsData, isLoading } = useMyPayments();
  const [page, setPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>('payment_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const itemsPerPage = 10;

  // Process data
  const processedData = useMemo(() => {
    let result = paymentsData || [];

    // Apply search
    if (searchQuery) {
      result = filterBySearch(result, searchQuery, ['transaction_ref', 'notes'] as any[]);
    }

    // Apply filters
    if (Object.values(filters).some(v => v)) {
      result = filterByMultiple(result, filters);
    }

    // Apply sorting
    if (sortColumn) {
      result = sortBy(result, sortColumn, sortDirection || 'asc');
    }

    return result;
  }, [paymentsData, searchQuery, filters, sortColumn, sortDirection]);

  // Paginate
  const paginatedData = useMemo(() => {
    return paginate(processedData, page, itemsPerPage);
  }, [processedData, page]);

  const handleSort = (column: string, direction: 'asc' | 'desc' | null) => {
    setSortColumn(column);
    setSortDirection(direction);
    setPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleFilter = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setPage(1);
  };

  const columns: TableColumn<Payment>[] = [
    {
      key: 'payment_date',
      label: 'Date',
      sortable: true,
      render: (value) => formatDisplayDate(value),
    },
    {
      key: 'method',
      label: 'Method',
      sortable: true,
      render: (value: PaymentMethod) => {
        const methodLabel: Record<PaymentMethod, string> = {
          M_PESA: 'M-Pesa',
          BANK: 'Bank Transfer',
          CASH: 'Cash',
          CHEQUE: 'Cheque',
        };
        return methodLabel[value] || value;
      },
    },
    {
      key: 'amount_paid',
      label: 'Amount',
      sortable: true,
      align: 'right',
      render: (value) => formatCurrency(value),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: PaymentStatus) => (
        <span
          className={`px-md py-sm rounded-full text-small font-semibold ${
            value === 'VERIFIED'
              ? 'bg-success-light text-success'
              : value === 'PENDING'
              ? 'bg-warning-light text-warning'
              : 'bg-error-light text-error'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'transaction_ref',
      label: 'Reference',
      render: (value) => value || '—',
    },
  ];

  return (
    <div className="space-y-lg">
      {/* Header */}
      <div>
        <h2 className="text-h2 font-bold text-neutral-900">Payment History</h2>
        <p className="text-body text-neutral-600 mt-base">
          View and manage your course payment records
        </p>
      </div>

      {/* Quick Filter */}
      <QuickFilter
        options={PAYMENT_STATUS_OPTIONS}
        activeValue={filters.status || ''}
        onSelect={(value) => handleFilter({ ...filters, status: value })}
      />

      {/* Search and Filter */}
      <FilterBar
        placeholder="Search by transaction reference..."
        onSearch={handleSearch}
        filters={[
          {
            id: 'method',
            label: 'Payment Method',
            options: PAYMENT_METHOD_OPTIONS,
          },
        ]}
        onFilter={handleFilter}
      />

      {/* Table */}
      <Table
        columns={columns}
        data={paginatedData.data}
        keyExtractor={(p) => p.id}
        sortColumn={sortColumn || undefined}
        sortDirection={sortDirection || undefined}
        onSort={handleSort}
        striped={true}
        hoverable={true}
        isLoading={isLoading}
      />

      {/* Pagination */}
      {paginatedData.totalPages > 1 && (
        <Pagination
          currentPage={paginatedData.currentPage}
          totalPages={paginatedData.totalPages}
          onPageChange={setPage}
          totalItems={paginatedData.totalItems}
          itemsPerPage={itemsPerPage}
          isLoading={isLoading}
        />
      )}

      {/* Empty State */}
      {!isLoading && processedData.length === 0 && (
        <div className="text-center py-2xl px-lg">
          <p className="text-neutral-600">No payments found</p>
          <p className="text-small text-neutral-500 mt-base">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}

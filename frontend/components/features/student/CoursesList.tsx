/**
 * Courses List Component
 * Displays student courses with filtering and pagination
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useMyEnrollments } from '@/hooks/useEnrollments';
import { QuickFilter } from '@/components/shared/FilterBar';
import { Pagination } from '@/components/shared/Pagination';
import { filterByMultiple, paginate } from '@/lib/sorting';
import type { Enrollment, EnrollmentStatus } from '@/types';

const STATUS_OPTIONS = [
  { value: '', label: 'All Courses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'SUSPENDED', label: 'Suspended' },
];

export function CoursesList() {
  const { data: enrollments, isLoading } = useMyEnrollments();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('ACTIVE');

  const itemsPerPage = 6;

  // Filter by status
  const filteredData = useMemo(() => {
    if (!enrollments) return [];
    if (!statusFilter) return enrollments;
    return enrollments.filter((e) => e.status === statusFilter);
  }, [enrollments, statusFilter]);

  // Paginate
  const paginatedData = useMemo(() => {
    return paginate(filteredData, page, itemsPerPage);
  }, [filteredData, page]);

  const getStatusColor = (status: EnrollmentStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-success-light text-success';
      case 'COMPLETED':
        return 'bg-brand-light text-brand';
      case 'SUSPENDED':
        return 'bg-warning-light text-warning';
      default:
        return 'bg-neutral-100 text-neutral-900';
    }
  };

  return (
    <div className="space-y-lg">
      {/* Header */}
      <div>
        <h2 className="text-h2 font-bold text-neutral-900">My Courses</h2>
        <p className="text-body text-neutral-600 mt-base">
          {filteredData.length} course{filteredData.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Status Filter */}
      <QuickFilter
        options={STATUS_OPTIONS}
        activeValue={statusFilter}
        onSelect={setStatusFilter}
      />

      {/* Course Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-lg border border-neutral-200">
              <div className="h-6 bg-neutral-200 rounded animate-skeleton mb-md" />
              <div className="h-4 bg-neutral-200 rounded animate-skeleton mb-md" />
              <div className="h-12 bg-neutral-200 rounded animate-skeleton" />
            </div>
          ))}
        </div>
      ) : paginatedData.data.length === 0 ? (
        <div className="text-center py-2xl px-lg bg-neutral-50 rounded-lg">
          <p className="text-neutral-600">No courses in this category</p>
          <p className="text-small text-neutral-500 mt-base">
            Try selecting a different status
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {paginatedData.data.map((enrollment) => (
            <div
              key={enrollment.id}
              className="card-hover bg-white rounded-lg p-lg border border-neutral-200 space-y-md cursor-pointer"
            >
              {/* Course Info */}
              <div>
                <h3 className="text-h3 font-bold text-neutral-900">
                  {typeof enrollment.course === 'string'
                    ? enrollment.course
                    : enrollment.course?.name}
                </h3>
                <p className="text-small text-neutral-600 mt-base">
                  {typeof enrollment.batch === 'string'
                    ? enrollment.batch
                    : enrollment.batch?.name}
                </p>
              </div>

              {/* Status Badge */}
              <div>
                <span
                  className={`inline-block px-md py-sm rounded-full text-small font-semibold ${getStatusColor(
                    enrollment.status
                  )}`}
                >
                  {enrollment.status}
                </span>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-base">
                  <span className="text-small text-neutral-600">Progress</span>
                  <span className="text-small font-semibold text-neutral-900">
                    {enrollment.progress}%
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className="bg-brand h-2 rounded-full transition-all"
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
              </div>

              {/* Attendance */}
              {enrollment.attendance_percentage !== null && (
                <div className="pt-base border-t border-neutral-200">
                  <div className="flex items-center justify-between">
                    <span className="text-small text-neutral-600">Attendance</span>
                    <span className="text-small font-semibold text-neutral-900">
                      {enrollment.attendance_percentage}%
                    </span>
                  </div>
                </div>
              )}

              {/* Fees Info */}
              {enrollment.balance > 0 && (
                <div className="pt-base border-t border-neutral-200">
                  <p className="text-small text-error">
                    Balance: Ksh {enrollment.balance.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

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
    </div>
  );
}

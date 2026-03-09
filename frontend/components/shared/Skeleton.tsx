/**
 * Loading Skeleton Component - Phase 3 Enhancement
 * Animated skeleton loaders with multiple variants
 * Respects prefers-reduced-motion
 */

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'rounded';
}

/**
 * Base skeleton component with shimmer animation
 */
export function Skeleton({ className, variant = 'default' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-skeleton bg-gradient-to-r from-neutral-100 via-neutral-50 to-neutral-100',
        variant === 'rounded' && 'rounded-full',
        variant === 'default' && 'rounded-md',
        className
      )}
      aria-hidden="true"
    />
  );
}

/**
 * KPI Card Skeleton - for dashboard metric cards
 */
export function KPICardSkeleton() {
  return (
    <div className="bg-white rounded-lg p-lg shadow-md border border-neutral-200 space-y-base">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-sm">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-12 w-12 rounded-lg" />
      </div>
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

/**
 * Course Card Skeleton - for course listings
 */
export function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-lg p-md border border-neutral-200 space-y-base">
      {/* Title and Instructor */}
      <div className="space-y-sm">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>

      {/* Progress Section */}
      <div className="space-y-sm">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * Dashboard Loading Grid - Multiple KPI skeletons
 */
export function DashboardKPISkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
      <KPICardSkeleton />
      <KPICardSkeleton />
      <KPICardSkeleton />
      <KPICardSkeleton />
    </div>
  );
}

/**
 * Courses Section Skeleton - Title + course cards
 */
export function CoursesSectionSkeleton() {
  return (
    <div className="bg-white rounded-lg p-lg shadow-md border border-neutral-200 space-y-lg">
      <div>
        <Skeleton className="h-6 w-48 mb-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
        </div>
      </div>
    </div>
  );
}

/**
 * Table Row Skeleton - for data tables
 */
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-md p-md border-b border-neutral-200">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
  );
}

/**
 * Table Skeleton - Multiple rows with header
 */
export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-md p-md bg-neutral-50 border-b border-neutral-200">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 flex-1" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={`row-${i}`} columns={columns} />
      ))}
    </div>
  );
}

/**
 * Alert Banner Skeleton
 */
export function AlertBannerSkeleton() {
  return (
    <div className="p-md bg-neutral-50 border-l-4 border-neutral-200 rounded-lg flex items-start gap-base">
      <Skeleton className="h-6 w-6 rounded" />
      <div className="flex-1 space-y-sm">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

/**
 * Full Page Loading State
 */
export function PageLoadingSkeleton() {
  return (
    <div className="space-y-lg p-md lg:p-lg">
      {/* Header */}
      <div className="space-y-base">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Alert Banner */}
      <AlertBannerSkeleton />

      {/* KPI Cards */}
      <DashboardKPISkeleton />

      {/* Courses Section */}
      <CoursesSectionSkeleton />

      {/* Quick Start Guide */}
      <div className="bg-brand-light rounded-lg p-lg border border-brand space-y-md">
        <Skeleton className="h-5 w-32" />
        <div className="space-y-sm">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`item-${i}`} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

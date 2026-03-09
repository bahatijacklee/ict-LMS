/**
 * Empty State Components - Phase 3 Enhancement
 * Display when no content is available with contextual messaging
 */

import { LucideIcon, BookOpen, CreditCard, CalendarX, FileText, Search, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * Base Empty State Component
 * Shows icon, title, description, and optional action button
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-xl px-md',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center mb-lg">
        <Icon size={32} className="text-brand" />
      </div>
      <h3 className="text-h3 font-bold text-neutral-900 mb-base">{title}</h3>
      <p className="text-body text-neutral-600 text-center max-w-md mb-lg">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/**
 * No Courses Empty State
 * Used when student has no enrolled courses
 */
export function NoCourseState({ onEnroll }: { onEnroll?: () => void }) {
  return (
    <EmptyState
      icon={BookOpen}
      title="No Courses Yet"
      description="You haven't enrolled in any courses. Browse available courses and start learning today."
      actionLabel="Browse Courses"
      onAction={onEnroll}
    />
  );
}

/**
 * No Payments Empty State
 * Used when student has no payment history
 */
export function NoPaymentsState({ onPayNow }: { onPayNow?: () => void }) {
  return (
    <EmptyState
      icon={CreditCard}
      title="No Payments Yet"
      description="You haven't made any payments. View your fee schedule and submit a payment."
      actionLabel="View Fees"
      onAction={onPayNow}
    />
  );
}

/**
 * No Attendance Empty State
 * Used when attendance records are unavailable
 */
export function NoAttendanceState() {
  return (
    <EmptyState
      icon={CalendarX}
      title="No Attendance Records"
      description="Your attendance records will appear here once classes start. Check back soon."
    />
  );
}

/**
 * No Materials Empty State
 * Used when course has no uploaded materials
 */
export function NoMaterialsState({ onUpload }: { onUpload?: () => void }) {
  return (
    <EmptyState
      icon={FileText}
      title="No Materials Available"
      description="The instructor hasn't uploaded any course materials yet. Check back later."
      actionLabel={onUpload ? 'Upload Materials' : undefined}
      onAction={onUpload}
    />
  );
}

/**
 * Error State - Generic error display
 */
export function ErrorState({ 
  message = 'Something went wrong',
  onRetry 
}: { 
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-xl px-md">
      <div className="w-16 h-16 rounded-full bg-error-light flex items-center justify-center mb-lg">
        <AlertTriangle size={32} className="text-error" />
      </div>
      <h3 className="text-h3 font-bold text-neutral-900 mb-base">Error Loading Content</h3>
      <p className="text-body text-neutral-600 text-center max-w-md mb-lg">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-secondary"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

/**
 * No Search Results Empty State
 */
export function NoSearchResults({ 
  query,
  onClear 
}: { 
  query: string;
  onClear?: () => void;
}) {
  return (
    <EmptyState
      icon={Search}
      title="No Results Found"
      description={`We couldn't find any results for "${query}". Try a different search term.`}
      actionLabel={onClear ? 'Clear Search' : undefined}
      onAction={onClear}
    />
  );
}

/**
 * Inline Empty State - Compact version for lists/grids
 */
export function InlineEmptyState({
  icon: Icon,
  title,
  description,
}: Omit<EmptyStateProps, 'actionLabel' | 'onAction'>) {
  return (
    <div className="text-center py-lg px-md">
      <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-base">
        <Icon size={24} className="text-neutral-400" />
      </div>
      <h4 className="text-h3 font-semibold text-neutral-600 mb-sm">{title}</h4>
      <p className="text-small text-neutral-500">{description}</p>
    </div>
  );
}

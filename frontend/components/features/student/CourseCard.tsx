/**
 * CourseCard Component
 * Reusable course card for student portal
 */

'use client';

import Link from 'next/link';
import { BookOpen, Users, TrendingUp, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { Enrollment } from '@/types';
import { formatCurrency, calculatePercentage } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  enrollment: Enrollment;
}

export default function CourseCard({ enrollment }: CourseCardProps) {
  const { course, status, progress, attendance_percentage, current_grade, balance } = enrollment;

  // Status badge styling
  const statusStyles = {
    ACTIVE: 'bg-success/10 text-success',
    COMPLETED: 'bg-primary/10 text-primary',
    SUSPENDED: 'bg-error/10 text-error',
    DROPPED: 'bg-gray-100 text-text-secondary',
  };

  const statusIcons = {
    ACTIVE: Clock,
    COMPLETED: CheckCircle,
    SUSPENDED: XCircle,
    DROPPED: XCircle,
  };

  const StatusIcon = statusIcons[status as keyof typeof statusIcons] || Clock;

  return (
    <Link
      href={`/student/courses/${enrollment.id}`}
      className="block group bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-200"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-h3 font-semibold text-text group-hover:text-primary transition-colors mb-1">
              {course.name}
            </h3>
            <p className="text-small text-text-secondary">{course.course_code}</p>
          </div>
          <div
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label font-medium',
              statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-text-secondary'
            )}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            {status}
          </div>
        </div>

        {/* Course Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-body text-text-secondary">
            <Users className="w-4 h-4" />
            <span className="text-small">
              Batch: {enrollment.batch?.name || 'Not assigned'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-body text-text-secondary">
            <Calendar className="w-4 h-4" />
            <span className="text-small">
              Level: {course.level || 'N/A'}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        {status === 'ACTIVE' && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-label text-text-secondary">Progress</span>
              <span className="text-label font-medium text-primary">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <div>
              <p className="text-label text-text-secondary">Attendance</p>
              <p className="text-body font-semibold text-text">
                {attendance_percentage !== null ? `${attendance_percentage}%` : 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-success" />
            <div>
              <p className="text-label text-text-secondary">Grade</p>
              <p className="text-body font-semibold text-text">
                {current_grade || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Fee Alert */}
        {balance > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-small text-text-secondary">Outstanding balance:</span>
              <span className="text-body font-semibold text-error">
                {formatCurrency(balance)}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

/**
 * My Courses Page
 * Display all student enrollments with filters
 */

'use client';

import { useState } from 'react';
import { Search, BookOpen } from 'lucide-react';
import CourseCard from '@/components/features/student/CourseCard';
import EmptyState from '@/components/shared/EmptyState';
import { CourseCardSkeleton } from '@/components/shared/Skeleton';
import { useMyEnrollments } from '@/hooks/useEnrollments';
import type { Enrollment } from '@/types';

type StatusFilter = 'all' | 'ACTIVE' | 'COMPLETED' | 'SUSPENDED' | 'DROPPED';

export default function MyCoursesPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: enrollments, isLoading, error } = useMyEnrollments();

  // Filter enrollments
  const filteredEnrollments = enrollments?.filter((enrollment: Enrollment) => {
    const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      enrollment.course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.course.course_code.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Status counts
  const statusCounts = {
    all: enrollments?.length || 0,
    ACTIVE: enrollments?.filter((e: Enrollment) => e.status === 'ACTIVE').length || 0,
    COMPLETED: enrollments?.filter((e: Enrollment) => e.status === 'COMPLETED').length || 0,
    SUSPENDED: enrollments?.filter((e: Enrollment) => e.status === 'SUSPENDED').length || 0,
  };

  const filters: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'All Courses' },
    { key: 'ACTIVE', label: 'Active' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'SUSPENDED', label: 'Suspended' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-h1 font-bold text-text mb-2">My Courses</h1>
        <p className="text-body text-text-secondary">
          View all your enrolled courses, track progress, and manage your learning journey
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
        <input
          type="text"
          placeholder="Search courses by name or code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => {
          const isActive = statusFilter === filter.key;
          const count = statusCounts[filter.key as keyof typeof statusCounts];

          return (
            <button
              key={filter.key}
              onClick={() => setStatusFilter(filter.key)}
              className={`px-4 py-2 rounded-lg font-medium text-body whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary text-white'
                  : 'bg-white text-text-secondary border border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              {filter.label}
              <span
                className={`ml-2 ${
                  isActive ? 'text-white/80' : 'text-text-secondary'
                }`}
              >
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <p className="text-body text-error">
            Failed to load courses. Please try again later.
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Course Grid */}
      {!isLoading && !error && filteredEnrollments && filteredEnrollments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enrollment: Enrollment) => (
            <CourseCard key={enrollment.id} enrollment={enrollment} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredEnrollments && filteredEnrollments.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title={searchQuery ? 'No courses found' : 'No courses yet'}
          description={
            searchQuery
              ? `No courses match "${searchQuery}". Try a different search term.`
              : 'You are not enrolled in any courses yet. Contact the registrar to enroll in courses.'
          }
        />
      )}

      {/* Stats Summary */}
      {!isLoading && filteredEnrollments && filteredEnrollments.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-h3 font-semibold text-text mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-label text-text-secondary mb-1">Total Courses</p>
              <p className="text-h2 font-bold text-text">{statusCounts.all}</p>
            </div>
            <div>
              <p className="text-label text-text-secondary mb-1">Active</p>
              <p className="text-h2 font-bold text-success">{statusCounts.ACTIVE}</p>
            </div>
            <div>
              <p className="text-label text-text-secondary mb-1">Completed</p>
              <p className="text-h2 font-bold text-primary">{statusCounts.COMPLETED}</p>
            </div>
            <div>
              <p className="text-label text-text-secondary mb-1">Suspended</p>
              <p className="text-h2 font-bold text-error">{statusCounts.SUSPENDED}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

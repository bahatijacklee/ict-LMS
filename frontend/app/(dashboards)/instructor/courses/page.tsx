/**
 * Instructor Courses Page
 * List all courses taught by instructor
 */

'use client';

import Link from 'next/link';
import { BookOpen, Users, Calendar, TrendingUp, Search } from 'lucide-react';
import { useState } from 'react';
import { useMyTeachingCourses } from '@/hooks/useInstructor';
import { Skeleton } from '@/components/shared/Skeleton';
import EmptyState from '@/components/shared/EmptyState';
import { formatDate } from '@/lib/utils';

export default function InstructorCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: courses, isLoading } = useMyTeachingCourses();

  // Filter courses
  const filteredCourses = courses?.filter((course: any) => {
    const courseName = course.course?.name || course.name || '';
    const batchName = course.name || '';
    return (
      searchQuery === '' ||
      courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batchName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-h1 font-bold text-text mb-2">My Courses</h1>
        <p className="text-body text-text-secondary">
          Manage your teaching assignments and track student progress
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
        <input
          type="text"
          placeholder="Search courses by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      )}

      {/* Courses Grid */}
      {!isLoading && filteredCourses && filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((batch: any) => (
            <Link
              key={batch.id}
              href={`/instructor/courses/${batch.id}`}
              className="block group bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-h3 font-semibold text-text group-hover:text-primary transition-colors mb-1">
                      {batch.course?.name || 'Unknown Course'}
                    </h3>
                    <p className="text-small text-text-secondary">
                      Batch: {batch.name}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-full text-label font-medium ${
                      batch.is_active
                        ? 'bg-success/10 text-success'
                        : 'bg-gray-100 text-text-secondary'
                    }`}
                  >
                    {batch.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-label text-text-secondary">Students</p>
                      <p className="text-body font-semibold text-text">
                        {batch.current_students}/{batch.max_students}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-success" />
                    <div>
                      <p className="text-label text-text-secondary">Duration</p>
                      <p className="text-body font-semibold text-text">
                        {batch.course?.duration_weeks || '--'} weeks
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-small">
                    <span className="text-text-secondary">
                      Start: {formatDate(batch.start_date)}
                    </span>
                    <span className="text-text-secondary">
                      End: {formatDate(batch.end_date)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredCourses && filteredCourses.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title={searchQuery ? 'No courses found' : 'No courses assigned'}
          description={
            searchQuery
              ? `No courses match "${searchQuery}". Try a different search.`
              : 'You don\'t have any courses assigned yet.'
          }
        />
      )}
    </div>
  );
}

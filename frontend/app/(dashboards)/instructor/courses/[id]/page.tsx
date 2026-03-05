/**
 * Course Roster & Detail Page
 * View student list and manage course
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Users,
  Mail,
  Phone,
} from 'lucide-react';
import { useCourseEnrollments } from '@/hooks/useInstructor';
import { Skeleton } from '@/components/shared/Skeleton';
import EmptyState from '@/components/shared/EmptyState';
import { getInitials } from '@/lib/utils';
import type { Enrollment } from '@/types';

export default function CourseRosterPage() {
  const params = useParams();
  const batchId = params.id as string;
  const { data: enrollments, isLoading } = useCourseEnrollments(batchId);

  const [searchQuery, setSearchQuery] = useState('');

  // Filter students
  const filteredEnrollments = enrollments?.filter((enrollment: Enrollment) => {
    const student = enrollment.student;
    if (typeof student === 'string') return false;
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    const email = student.email.toLowerCase();
    return (
      searchQuery === '' ||
      fullName.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase())
    );
  });

  // Get batch info from first enrollment
  const batch = enrollments?.[0]?.batch;
  const course = enrollments?.[0]?.course;

  // Calculate stats
  const activeStudents = enrollments?.filter((e: Enrollment) => e.status === 'ACTIVE').length || 0;
  const avgAttendance =
    (enrollments?.reduce((sum: number, e: Enrollment) => sum + (e.attendance_percentage || 0), 0) || 0) /
      (enrollments?.length || 1);

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/instructor/courses"
        className="inline-flex items-center gap-2 text-body text-text-secondary hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Courses
      </Link>

      {/* Header */}
      {isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-h1 font-bold text-text mb-2">
                {course?.name || 'Course'}
              </h1>
              <p className="text-body text-text-secondary mb-4">
                Batch: {typeof batch === 'object' ? batch?.name : 'N/A'}
              </p>
              {course?.description && (
                <p className="text-body text-text">{course.description}</p>
              )}
            </div>
            <div className="flex gap-3">
              <Link
                href={`/instructor/courses/${batchId}/attendance`}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Mark Attendance
              </Link>
              <Link
                href={`/instructor/courses/${batchId}/grades`}
                className="px-4 py-2 bg-white border border-gray-200 text-text rounded-lg hover:border-primary hover:bg-primary/5 transition-colors font-medium"
              >
                Enter Grades
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div>
              <p className="text-label text-text-secondary mb-1">Total Students</p>
              <p className="text-h2 font-bold text-text">{enrollments?.length || 0}</p>
            </div>
            <div>
              <p className="text-label text-text-secondary mb-1">Active</p>
              <p className="text-h2 font-bold text-success">{activeStudents}</p>
            </div>
            <div>
              <p className="text-label text-text-secondary mb-1">Avg Attendance</p>
              <p className="text-h2 font-bold text-text">{Math.round(avgAttendance)}%</p>
            </div>
            <div>
              <p className="text-label text-text-secondary mb-1">Duration</p>
              <p className="text-h2 font-bold text-text">
                {course?.duration_weeks || '--'} weeks
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
        <input
          type="text"
          placeholder="Search students by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {/* Student Roster */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-h2 font-semibold text-text">Student Roster</h2>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : filteredEnrollments && filteredEnrollments.length > 0 ? (
            <div className="space-y-3">
              {filteredEnrollments.map((enrollment: Enrollment) => {
                const student = enrollment.student;
                if (typeof student === 'string') return null;

                return (
                  <div
                    key={enrollment.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
                        {getInitials(student.first_name, student.last_name)}
                      </div>
                      <div>
                        <h3 className="text-body font-semibold text-text mb-1">
                          {student.first_name} {student.last_name}
                        </h3>
                        <div className="flex items-center gap-4 text-small text-text-secondary">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" />
                            {student.email}
                          </span>
                          {student.phone_number && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5" />
                              {student.phone_number}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-label text-text-secondary mb-1">Progress</p>
                        <p className="text-body font-semibold text-primary">
                          {enrollment.progress}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-label text-text-secondary mb-1">Attendance</p>
                        <p className="text-body font-semibold text-text">
                          {enrollment.attendance_percentage ?? '--'}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-label text-text-secondary mb-1">Grade</p>
                        <p className="text-body font-semibold text-text">
                          {enrollment.current_grade || '--'}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-full text-label font-medium ${
                          enrollment.status === 'ACTIVE'
                            ? 'bg-success/10 text-success'
                            : enrollment.status === 'COMPLETED'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-error/10 text-error'
                        }`}
                      >
                        {enrollment.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title={searchQuery ? 'No students found' : 'No students enrolled'}
              description={
                searchQuery
                  ? `No students match "${searchQuery}".`
                  : 'No students are enrolled in this course yet.'
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

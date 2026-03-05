/**
 * Instructor Dashboard
 * Overview of teaching assignments and quick stats
 */

'use client';

import Link from 'next/link';
import {
  BookOpen,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useMyTeachingCourses } from '@/hooks/useInstructor';
import { Skeleton } from '@/components/shared/Skeleton';

export default function InstructorDashboardPage() {
  const { data: courses, isLoading } = useMyTeachingCourses();

  // Calculate stats
  const totalCourses = courses?.length || 0;
const totalStudents = courses?.reduce((sum: number, course: { current_students?: number }) =>
    sum + (course.current_students || 0), 0
  ) || 0;
  const activeCourses = courses?.filter((c: { is_active: boolean }) => c.is_active).length || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-h1 font-bold text-text mb-2">Instructor Dashboard</h1>
        <p className="text-body text-text-secondary">
          Manage your courses, track attendance, and grade students
        </p>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Courses */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-label text-text-secondary">Total Courses</p>
                <p className="text-h2 font-bold text-text">{totalCourses}</p>
              </div>
            </div>
          </div>

          {/* Active Courses */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-label text-text-secondary">Active Courses</p>
                <p className="text-h2 font-bold text-success">{activeCourses}</p>
              </div>
            </div>
          </div>

          {/* Total Students */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-orange/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-orange" />
              </div>
              <div>
                <p className="text-label text-text-secondary">Total Students</p>
                <p className="text-h2 font-bold text-text">{totalStudents}</p>
              </div>
            </div>
          </div>

          {/* Attendance Rate */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-label text-text-secondary">Avg Attendance</p>
                <p className="text-h2 font-bold text-text">--</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-h2 font-semibold text-text mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/instructor/courses"
            className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-body font-semibold text-text">My Courses</h3>
              <p className="text-small text-text-secondary">View all courses</p>
            </div>
          </Link>

          <Link
            href="/instructor/attendance"
            className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 className="text-body font-semibold text-text">Mark Attendance</h3>
              <p className="text-small text-text-secondary">Today&apos;s attendance</p>
            </div>
          </Link>

          <Link
            href="/instructor/grades"
            className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-orange/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange" />
            </div>
            <div>
              <h3 className="text-body font-semibold text-text">Grades</h3>
              <p className="text-small text-text-secondary">Enter grades</p>
            </div>
          </Link>
        </div>
      </div>

      {/* My Courses List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-h2 font-semibold text-text">My Courses</h2>
          <Link
            href="/instructor/courses"
            className="text-body text-primary hover:text-primary/80 font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : courses && courses.length > 0 ? (
            <div className="space-y-4">
              {courses.slice(0, 5).map((course) => (
                <Link
                  key={course.id}
                  href={`/instructor/courses/${course.id}`}
                  className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-body font-semibold text-text mb-1">
                        {course.course?.name || course.name}
                      </h3>
                      <p className="text-small text-text-secondary">
                        Batch: {course.name} • {course.current_students}/{course.max_students} students
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-text-secondary" />
                      <span className="text-body font-medium text-text">
                        {course.current_students}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-label font-medium ${
                        course.is_active
                          ? 'bg-success/10 text-success'
                          : 'bg-gray-100 text-text-secondary'
                      }`}
                    >
                      {course.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <h3 className="text-h3 font-semibold text-text mb-2">No Courses Assigned</h3>
              <p className="text-body text-text-secondary">
                You don&apos;t have any courses assigned yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="text-h2 font-semibold text-text">Today&apos;s Schedule</h2>
        </div>
        <p className="text-body text-text-secondary">
          Schedule view coming soon. You can mark attendance for any course from the courses page.
        </p>
      </div>
    </div>
  );
}

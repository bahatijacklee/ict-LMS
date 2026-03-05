/**
 * Attendance History Page
 * Display attendance records by course
 */

'use client';

import { useState } from 'react';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { useMyEnrollments } from '@/hooks/useEnrollments';
import { useMyAttendance } from '@/hooks/useAttendance';
import { Skeleton } from '@/components/shared/Skeleton';
import EmptyState from '@/components/shared/EmptyState';
import { formatDate } from '@/lib/utils';
import type { Enrollment, AttendanceRecord } from '@/types';

export default function AttendancePage() {
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: enrollments, isLoading: loadingEnrollments } = useMyEnrollments();
  const { data: attendanceRecords, isLoading: loadingAttendance } = useMyAttendance();

  const isLoading = loadingEnrollments || loadingAttendance;

  // Filter attendance records
  const filteredRecords = attendanceRecords?.filter((record: AttendanceRecord) => {
    const matchesCourse = selectedCourse === 'all' || record.enrollment.id === selectedCourse;
    const matchesStartDate = !startDate || record.date >= startDate;
    const matchesEndDate = !endDate || record.date <= endDate;
    return matchesCourse && matchesStartDate && matchesEndDate;
  });

  // Calculate stats
  const totalClasses = filteredRecords?.length || 0;
  const presentCount = filteredRecords?.filter((r: AttendanceRecord) => r.status === 'PRESENT').length || 0;
  const absentCount = filteredRecords?.filter((r: AttendanceRecord) => r.status === 'ABSENT').length || 0;
  const lateCount = filteredRecords?.filter((r: AttendanceRecord) => r.status === 'LATE').length || 0;
  const attendancePercentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-h1 font-bold text-text mb-2">Attendance History</h1>
        <p className="text-body text-text-secondary">
          Track your class attendance across all courses
        </p>
      </div>

      {/* Summary Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-primary" />
              <p className="text-label text-text-secondary">Total Classes</p>
            </div>
            <p className="text-h2 font-bold text-text">{totalClasses}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <p className="text-label text-text-secondary">Present</p>
            </div>
            <p className="text-h2 font-bold text-success">{presentCount}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="w-5 h-5 text-error" />
              <p className="text-label text-text-secondary">Absent</p>
            </div>
            <p className="text-h2 font-bold text-error">{absentCount}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-orange" />
              <p className="text-label text-text-secondary">Attendance Rate</p>
            </div>
            <p className="text-h2 font-bold text-text">{attendancePercentage}%</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="text-h3 font-semibold text-text">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-body font-medium text-text mb-2">
              Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="all">All Courses</option>
              {enrollments?.map((enrollment: Enrollment) => (
                <option key={enrollment.id} value={enrollment.id}>
                  {enrollment.course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-body font-medium text-text mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-body font-medium text-text mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>

      {/* Attendance by Course */}
      {!isLoading && enrollments && enrollments.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-h2 font-semibold text-text mb-4">
            Attendance by Course
          </h2>
          <div className="space-y-4">
            {enrollments.map((enrollment: Enrollment) => {
              const courseRecords = attendanceRecords?.filter(
                (r: AttendanceRecord) => r.enrollment.id === enrollment.id
              ) || [];
              const coursePresent = courseRecords.filter((r: AttendanceRecord) => r.status === 'PRESENT').length;
              const courseTotal = courseRecords.length;
              const coursePercentage = courseTotal > 0 ? Math.round((coursePresent / courseTotal) * 100) : 0;

              return (
                <div
                  key={enrollment.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gray-50 rounded-lg gap-4"
                >
                  <div className="flex-1">
                    <h3 className="text-body font-semibold text-text mb-1">
                      {enrollment.course.name}
                    </h3>
                    <p className="text-small text-text-secondary">
                      {coursePresent} of {courseTotal} classes attended
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-label text-text-secondary">Rate</span>
                        <span className="text-label font-semibold text-text">
                          {coursePercentage}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            coursePercentage >= 75
                              ? 'bg-success'
                              : coursePercentage >= 50
                              ? 'bg-orange'
                              : 'bg-error'
                          }`}
                          style={{ width: `${coursePercentage}%` }}
                        />
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1.5 rounded-full text-label font-medium ${
                        coursePercentage >= 75
                          ? 'bg-success/10 text-success'
                          : coursePercentage >= 50
                          ? 'bg-orange/10 text-orange'
                          : 'bg-error/10 text-error'
                      }`}
                    >
                      {coursePercentage >= 75 ? 'Good' : coursePercentage >= 50 ? 'Fair' : 'Poor'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Attendance Records */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-h2 font-semibold text-text">Attendance Records</h2>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredRecords && filteredRecords.length > 0 ? (
            <div className="space-y-2">
              {filteredRecords.map((record: AttendanceRecord) => {
                const statusConfig = {
                  PRESENT: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
                  ABSENT: { icon: XCircle, color: 'text-error', bg: 'bg-error/10' },
                  LATE: { icon: Clock, color: 'text-orange', bg: 'bg-orange/10' },
                  EXCUSED: { icon: CheckCircle, color: 'text-primary', bg: 'bg-primary/10' },
                };

                const config = statusConfig[record.status as keyof typeof statusConfig] || statusConfig.ABSENT;
                const Icon = config.icon;

                return (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div>
                        <h3 className="text-body font-semibold text-text mb-1">
                          {record.enrollment.course?.name || 'Unknown Course'}
                        </h3>
                        <p className="text-small text-text-secondary">
                          {formatDate(record.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {record.remarks && (
                        <p className="text-small text-text-secondary max-w-xs truncate">
                          {record.remarks}
                        </p>
                      )}
                      <span className={`px-3 py-1.5 rounded-full text-label font-medium ${config.bg} ${config.color}`}>
                        {record.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="No attendance records"
              description={
                selectedCourse !== 'all' || startDate || endDate
                  ? 'No records match your filters. Try adjusting the filters.'
                  : 'No attendance records available yet.'
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

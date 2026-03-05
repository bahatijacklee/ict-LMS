/**
 * Attendance Marking Interface
 * Mark attendance for students in a course/batch
 */

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Save,
  Users,
} from 'lucide-react';
import { useCourseEnrollments, useBulkMarkAttendance } from '@/hooks/useInstructor';
import { Skeleton } from '@/components/shared/Skeleton';
import EmptyState from '@/components/shared/EmptyState';
import { getInitials } from '@/lib/utils';
import type { Enrollment } from '@/types';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

interface AttendanceEntry {
  enrollment: string;
  status: AttendanceStatus;
  remarks: string;
}

export default function MarkAttendancePage() {
  const params = useParams();
  const router = useRouter();
  const batchId = params.id as string;
  const { data: enrollments, isLoading } = useCourseEnrollments(batchId);
  const bulkMarkAttendance = useBulkMarkAttendance();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceEntries, setAttendanceEntries] = useState<Map<string, AttendanceEntry>>(
    new Map()
  );

  // Get batch/course info
  const batch = enrollments?.[0]?.batch;
  const course = enrollments?.[0]?.course;

  // Handle status change
  const handleStatusChange = (enrollmentId: string, status: AttendanceStatus) => {
    setAttendanceEntries((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(enrollmentId);
      newMap.set(enrollmentId, {
        enrollment: enrollmentId,
        status,
        remarks: existing?.remarks || '',
      });
      return newMap;
    });
  };

  // Handle remarks change
  const handleRemarksChange = (enrollmentId: string, remarks: string) => {
    setAttendanceEntries((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(enrollmentId);
      if (existing) {
        newMap.set(enrollmentId, { ...existing, remarks });
      }
      return newMap;
    });
  };

  // Bulk actions
  const markAllPresent = () => {
    enrollments?.forEach((enrollment: Enrollment) => {
      handleStatusChange(enrollment.id, 'PRESENT');
    });
  };

  const markAllAbsent = () => {
    enrollments?.forEach((enrollment: Enrollment) => {
      handleStatusChange(enrollment.id, 'ABSENT');
    });
  };

  // Submit attendance
  const handleSubmit = async () => {
    const records = Array.from(attendanceEntries.values());
    if (records.length === 0) {
      alert('Please mark attendance for at least one student');
      return;
    }

    const payload = {
      batch: batchId,
      date,
      records: records.map((entry) => ({
        enrollment: entry.enrollment,
        status: entry.status,
        remarks: entry.remarks || undefined,
      })),
    };

    try {
      await bulkMarkAttendance.mutateAsync(payload);
      alert('Attendance marked successfully!');
      router.push(`/instructor/courses/${batchId}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to mark attendance: ${errorMessage}`);
    }
  };

  // Count statuses
  const statusCounts = {
    present: Array.from(attendanceEntries.values()).filter((e) => e.status === 'PRESENT').length,
    absent: Array.from(attendanceEntries.values()).filter((e) => e.status === 'ABSENT').length,
    late: Array.from(attendanceEntries.values()).filter((e) => e.status === 'LATE').length,
    excused: Array.from(attendanceEntries.values()).filter((e) => e.status === 'EXCUSED').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Link
        href={`/instructor/courses/${batchId}`}
        className="inline-flex items-center gap-2 text-body text-text-secondary hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Course
      </Link>

      {/* Header */}
      {isLoading ? (
        <Skeleton className="h-24 w-full" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h1 className="text-h1 font-bold text-text mb-2">Mark Attendance</h1>
          <p className="text-body text-text-secondary">
            {course?.name} - Batch: {typeof batch === 'object' ? batch?.name : 'N/A'}
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Date Picker */}
          <div>
            <label className="block text-label font-medium text-text mb-2">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="pl-11 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Bulk Actions */}
          <div>
            <label className="block text-label font-medium text-text mb-2">Bulk Actions</label>
            <div className="flex gap-2">
              <button
                onClick={markAllPresent}
                className="px-4 py-2 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors font-medium text-body"
              >
                Mark All Present
              </button>
              <button
                onClick={markAllAbsent}
                className="px-4 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors font-medium text-body"
              >
                Mark All Absent
              </button>
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <div>
              <p className="text-label text-text-secondary">Present</p>
              <p className="text-body font-semibold text-text">{statusCounts.present}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-error" />
            <div>
              <p className="text-label text-text-secondary">Absent</p>
              <p className="text-body font-semibold text-text">{statusCounts.absent}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-warning" />
            <div>
              <p className="text-label text-text-secondary">Late</p>
              <p className="text-body font-semibold text-text">{statusCounts.late}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            <div>
              <p className="text-label text-text-secondary">Excused</p>
              <p className="text-body font-semibold text-text">{statusCounts.excused}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-h2 font-semibold text-text">Students</h2>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : enrollments && enrollments.length > 0 ? (
            <div className="space-y-3">
              {enrollments.map((enrollment: Enrollment) => {
                const student = enrollment.student;
                if (typeof student === 'string') return null;

                const entry = attendanceEntries.get(enrollment.id);
                const status = entry?.status;

                return (
                  <div
                    key={enrollment.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
                        {getInitials(student.first_name, student.last_name)}
                      </div>
                      <div className="flex-1 space-y-3">
                        <h3 className="text-body font-semibold text-text">
                          {student.first_name} {student.last_name}
                        </h3>

                        {/* Status Radio Buttons */}
                        <div className="flex flex-wrap gap-2">
                          {(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as AttendanceStatus[]).map(
                            (statusOption) => (
                              <label
                                key={statusOption}
                                className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg cursor-pointer transition-all ${
                                  status === statusOption
                                    ? statusOption === 'PRESENT'
                                      ? 'border-success bg-success/10 text-success'
                                      : statusOption === 'ABSENT'
                                      ? 'border-error bg-error/10 text-error'
                                      : statusOption === 'LATE'
                                      ? 'border-warning bg-warning/10 text-warning'
                                      : 'border-primary bg-primary/10 text-primary'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`attendance-${enrollment.id}`}
                                  checked={status === statusOption}
                                  onChange={() => handleStatusChange(enrollment.id, statusOption)}
                                  className="sr-only"
                                />
                                <span className="text-body font-medium">{statusOption}</span>
                              </label>
                            )
                          )}
                        </div>

                        {/* Remarks */}
                        <input
                          type="text"
                          placeholder="Remarks (optional)"
                          value={entry?.remarks || ''}
                          onChange={(e) => handleRemarksChange(enrollment.id, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-body"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No students enrolled"
              description="No students are enrolled in this course yet."
            />
          )}
        </div>
      </div>

      {/* Submit Button */}
      {enrollments && enrollments.length > 0 && (
        <div className="flex justify-end gap-3">
          <Link
            href={`/instructor/courses/${batchId}`}
            className="px-6 py-3 border border-gray-200 text-text rounded-lg hover:border-primary hover:bg-primary/5 transition-colors font-medium"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={bulkMarkAttendance.isPending || attendanceEntries.size === 0}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {bulkMarkAttendance.isPending ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      )}
    </div>
  );
}

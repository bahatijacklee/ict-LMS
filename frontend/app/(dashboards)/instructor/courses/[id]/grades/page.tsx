/**
 * Grade Entry Interface
 * Enter and update grades for students in a course/batch
 */

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Award, Users } from 'lucide-react';
import { useCourseEnrollments, useUpdateGrade } from '@/hooks/useInstructor';
import { Skeleton } from '@/components/shared/Skeleton';
import EmptyState from '@/components/shared/EmptyState';
import { getInitials } from '@/lib/utils';
import type { Enrollment } from '@/types';

interface GradeEntry {
  enrollmentId: string;
  grade: string;
  notes: string;
}

export default function GradesPage() {
  const params = useParams();
  const router = useRouter();
  const batchId = params.id as string;
  const { data: enrollments, isLoading } = useCourseEnrollments(batchId);
  const updateGrade = useUpdateGrade();

  const [gradeEntries, setGradeEntries] = useState<Map<string, GradeEntry>>(new Map());
  const [savingId, setSavingId] = useState<string | null>(null);

  // Get batch/course info
  const batch = enrollments?.[0]?.batch;
  const course = enrollments?.[0]?.course;

  // Initialize grade entries from enrollment data
  const getGradeEntry = (enrollment: Enrollment): GradeEntry => {
    if (gradeEntries.has(enrollment.id)) {
      return gradeEntries.get(enrollment.id)!;
    }
    return {
      enrollmentId: enrollment.id,
      grade: enrollment.current_grade || '',
      notes: enrollment.notes || '',
    };
  };

  // Handle grade change
  const handleGradeChange = (enrollmentId: string, grade: string) => {
    setGradeEntries((prev) => {
      const newMap = new Map(prev);
      const existing = gradeEntries.get(enrollmentId) || {
        enrollmentId,
        grade: '',
        notes: '',
      };
      newMap.set(enrollmentId, { ...existing, grade });
      return newMap;
    });
  };

  // Handle notes change
  const handleNotesChange = (enrollmentId: string, notes: string) => {
    setGradeEntries((prev) => {
      const newMap = new Map(prev);
      const existing = gradeEntries.get(enrollmentId) || {
        enrollmentId,
        grade: '',
        notes: '',
      };
      newMap.set(enrollmentId, { ...existing, notes });
      return newMap;
    });
  };

  // Save individual grade
  const handleSaveGrade = async (enrollmentId: string) => {
    const entry = gradeEntries.get(enrollmentId);
    if (!entry || !entry.grade) {
      alert('Please enter a grade');
      return;
    }

    setSavingId(enrollmentId);
    try {
      await updateGrade.mutateAsync({
        enrollmentId,
        data: {
          enrollment: enrollmentId,
          final_grade: entry.grade,
          comments: entry.notes || undefined,
        },
      });
      alert('Grade saved successfully!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to save grade: ${errorMessage}`);
    } finally {
      setSavingId(null);
    }
  };

  // Save all grades
  const handleSaveAll = async () => {
    const entriesToSave = Array.from(gradeEntries.values()).filter((entry) => entry.grade);
    if (entriesToSave.length === 0) {
      alert('No grades to save');
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const entry of entriesToSave) {
      try {
        await updateGrade.mutateAsync({
          enrollmentId: entry.enrollmentId,
          data: {
            enrollment: entry.enrollmentId,
            final_grade: entry.grade,
            comments: entry.notes || undefined,
          },
        });
        successCount++;
      } catch {
        failCount++;
      }
    }

    if (failCount === 0) {
      alert(`All ${successCount} grades saved successfully!`);
      router.push(`/instructor/courses/${batchId}`);
    } else {
      alert(`Saved ${successCount} grades. ${failCount} failed.`);
    }
  };

  // Grade options
  const gradeOptions = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];

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
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-h1 font-bold text-text mb-2">Enter Grades</h1>
              <p className="text-body text-text-secondary">
                {course?.name} - Batch: {typeof batch === 'object' ? batch?.name : 'N/A'}
              </p>
            </div>
            <button
              onClick={handleSaveAll}
              disabled={updateGrade.isPending || gradeEntries.size === 0}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save All Grades
            </button>
          </div>
        </div>
      )}

      {/* Student List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-h2 font-semibold text-text">Students</h2>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : enrollments && enrollments.length > 0 ? (
            <div className="space-y-4">
              {enrollments.map((enrollment: Enrollment) => {
                const student = enrollment.student;
                if (typeof student === 'string') return null;

                const entry = getGradeEntry(enrollment);
                const isSaving = savingId === enrollment.id;

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
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-body font-semibold text-text mb-1">
                              {student.first_name} {student.last_name}
                            </h3>
                            <p className="text-small text-text-secondary">{student.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-label text-text-secondary">Current Grade</p>
                            <p className="text-h3 font-bold text-primary">
                              {enrollment.current_grade || '--'}
                            </p>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-label text-text-secondary">Progress</p>
                            <p className="text-body font-semibold text-text">
                              {enrollment.progress}%
                            </p>
                          </div>
                          <div>
                            <p className="text-label text-text-secondary">Attendance</p>
                            <p className="text-body font-semibold text-text">
                              {enrollment.attendance_percentage ?? '--'}%
                            </p>
                          </div>
                          <div>
                            <p className="text-label text-text-secondary">Status</p>
                            <p
                              className={`text-body font-semibold ${
                                enrollment.status === 'ACTIVE'
                                  ? 'text-success'
                                  : 'text-text-secondary'
                              }`}
                            >
                              {enrollment.status}
                            </p>
                          </div>
                        </div>

                        {/* Grade Entry */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-label font-medium text-text mb-2">
                              Grade *
                            </label>
                            <select
                              value={entry.grade}
                              onChange={(e) => handleGradeChange(enrollment.id, e.target.value)}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-body"
                            >
                              <option value="">Select Grade</option>
                              {gradeOptions.map((grade) => (
                                <option key={grade} value={grade}>
                                  {grade}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-label font-medium text-text mb-2">
                              Notes (optional)
                            </label>
                            <input
                              type="text"
                              placeholder="Add notes..."
                              value={entry.notes}
                              onChange={(e) => handleNotesChange(enrollment.id, e.target.value)}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-body"
                            />
                          </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleSaveGrade(enrollment.id)}
                            disabled={isSaving || !entry.grade}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-body flex items-center gap-2"
                          >
                            <Award className="w-4 h-4" />
                            {isSaving ? 'Saving...' : 'Save Grade'}
                          </button>
                        </div>
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

      {/* Bottom Action Bar */}
      {enrollments && enrollments.length > 0 && (
        <div className="flex justify-end gap-3">
          <Link
            href={`/instructor/courses/${batchId}`}
            className="px-6 py-3 border border-gray-200 text-text rounded-lg hover:border-primary hover:bg-primary/5 transition-colors font-medium"
          >
            Cancel
          </Link>
          <button
            onClick={handleSaveAll}
            disabled={updateGrade.isPending || gradeEntries.size === 0}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {updateGrade.isPending ? 'Saving...' : 'Save All Grades'}
          </button>
        </div>
      )}
    </div>
  );
}

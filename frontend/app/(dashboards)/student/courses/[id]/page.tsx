/**
 * Course Detail Page
 * View single course with tabs
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Calendar,
  Award,
  ClipboardList,
  Clock,
  TrendingUp,
  Users,
  CheckCircle,
} from 'lucide-react';
import { useEnrollment } from '@/hooks/useEnrollments';
import { Skeleton } from '@/components/shared/Skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';

type TabKey = 'overview' | 'materials' | 'attendance' | 'grades' | 'assignments';

export default function CourseDetailPage() {
  const params = useParams();
  const enrollmentId = params.id as string;
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const { data: enrollment, isLoading, error } = useEnrollment(enrollmentId);

  const tabs = [
    { key: 'overview' as TabKey, label: 'Overview', icon: BookOpen },
    { key: 'materials' as TabKey, label: 'Materials', icon: FileText },
    { key: 'attendance' as TabKey, label: 'Attendance', icon: Calendar },
    { key: 'grades' as TabKey, label: 'Grades', icon: Award },
    { key: 'assignments' as TabKey, label: 'Assignments', icon: ClipboardList },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !enrollment) {
    return (
      <div className="bg-error/10 border border-error/20 rounded-lg p-6">
        <p className="text-body text-error">Failed to load course details.</p>
      </div>
    );
  }

  const { course, status, progress, attendance_percentage, current_grade, balance } = enrollment;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/student/courses"
        className="inline-flex items-center gap-2 text-body text-text-secondary hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Courses
      </Link>

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-h1 font-bold text-text">{course.name}</h1>
              <span
                className={`px-3 py-1 rounded-full text-label font-medium ${
                  status === 'ACTIVE'
                    ? 'bg-success/10 text-success'
                    : status === 'COMPLETED'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-error/10 text-error'
                }`}
              >
                {status}
              </span>
            </div>
            <p className="text-body text-text-secondary mb-4">{course.course_code}</p>
            {course.description && (
              <p className="text-body text-text leading-relaxed">{course.description}</p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="flex md:flex-col gap-4 md:items-end">
            <div className="text-center md:text-right">
              <p className="text-label text-text-secondary mb-1">Progress</p>
              <p className="text-h2 font-bold text-primary">{progress}%</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-label text-text-secondary mb-1">Grade</p>
              <p className="text-h2 font-bold text-text">{current_grade || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-label text-text-secondary">Batch</p>
              <p className="text-body font-medium text-text">
                {enrollment.batch?.name || 'Not assigned'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-label text-text-secondary">Attendance</p>
              <p className="text-body font-medium text-text">
                {attendance_percentage !== null ? `${attendance_percentage}%` : 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange" />
            </div>
            <div>
              <p className="text-label text-text-secondary">Level</p>
              <p className="text-body font-medium text-text">{course.level || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg ${
                balance > 0 ? 'bg-error/10' : 'bg-success/10'
              } flex items-center justify-center`}
            >
              <TrendingUp className={`w-5 h-5 ${balance > 0 ? 'text-error' : 'text-success'}`} />
            </div>
            <div>
              <p className="text-label text-text-secondary">Balance</p>
              <p
                className={`text-body font-medium ${balance > 0 ? 'text-error' : 'text-success'}`}
              >
                {formatCurrency(balance)}
              </p>
            </div>
          </div>
        </div>

        {/* Fee Alert */}
        {balance > 0 && (
          <Link
            href="/student/fees"
            className="mt-6 flex items-center justify-between p-4 bg-error/5 border border-error/20 rounded-lg hover:bg-error/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-error" />
              </div>
              <div>
                <p className="text-body font-medium text-text">Outstanding Fee Balance</p>
                <p className="text-small text-text-secondary">
                  You have an outstanding balance of {formatCurrency(balance)}
                </p>
              </div>
            </div>
            <span className="text-body font-medium text-primary">Pay Now →</span>
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex gap-1 p-2 border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-body whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-gray-50 hover:text-text'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && <OverviewTab enrollment={enrollment} />}
          {activeTab === 'materials' && <MaterialsTab />}
          {activeTab === 'attendance' && <AttendanceTab enrollmentId={enrollmentId} />}
          {activeTab === 'grades' && <GradesTab enrollmentId={enrollmentId} />}
          {activeTab === 'assignments' && <AssignmentsTab />}
        </div>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ enrollment }: { enrollment: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-h3 font-semibold text-text mb-3">Course Progress</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-body text-text-secondary">Overall Progress</span>
            <span className="text-body font-semibold text-primary">{enrollment.progress}%</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/80"
              style={{ width: `${enrollment.progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-primary/5 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            <h4 className="text-body font-semibold text-text">Enrollment Details</h4>
          </div>
          <div className="space-y-2 text-small">
            <div className="flex justify-between">
              <span className="text-text-secondary">Enrolled On:</span>
              <span className="font-medium text-text">
                {formatDate(enrollment.created_at)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Status:</span>
              <span className="font-medium text-text">{enrollment.status}</span>
            </div>
            {enrollment.batch && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Batch:</span>
                <span className="font-medium text-text">{enrollment.batch.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-success/5 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-success" />
            <h4 className="text-body font-semibold text-text">Performance</h4>
          </div>
          <div className="space-y-2 text-small">
            <div className="flex justify-between">
              <span className="text-text-secondary">Attendance:</span>
              <span className="font-medium text-text">
                {enrollment.attendance_percentage !== null
                  ? `${enrollment.attendance_percentage}%`
                  : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Current Grade:</span>
              <span className="font-medium text-text">{enrollment.current_grade || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Progress:</span>
              <span className="font-medium text-text">{enrollment.progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {enrollment.notes && (
        <div>
          <h3 className="text-h3 font-semibold text-text mb-3">Notes</h3>
          <p className="text-body text-text-secondary leading-relaxed">{enrollment.notes}</p>
        </div>
      )}
    </div>
  );
}

// Materials Tab Component
function MaterialsTab() {
  return (
    <div className="text-center py-12">
      <FileText className="w-12 h-12 text-text-secondary mx-auto mb-4" />
      <h3 className="text-h3 font-semibold text-text mb-2">Course Materials</h3>
      <p className="text-body text-text-secondary">
        Course materials feature coming soon. Check back later.
      </p>
    </div>
  );
}

// Attendance Tab Component
function AttendanceTab({ enrollmentId }: { enrollmentId: string }) {
  return (
    <div className="text-center py-12">
      <Calendar className="w-12 h-12 text-text-secondary mx-auto mb-4" />
      <h3 className="text-h3 font-semibold text-text mb-2">Attendance History</h3>
      <p className="text-body text-text-secondary">
        Detailed attendance tracking coming soon.
      </p>
    </div>
  );
}

// Grades Tab Component
function GradesTab({ enrollmentId }: { enrollmentId: string }) {
  return (
    <div className="text-center py-12">
      <Award className="w-12 h-12 text-text-secondary mx-auto mb-4" />
      <h3 className="text-h3 font-semibold text-text mb-2">Grade Details</h3>
      <p className="text-body text-text-secondary">
        Detailed grade breakdown coming soon.
      </p>
    </div>
  );
}

// Assignments Tab Component
function AssignmentsTab() {
  return (
    <div className="text-center py-12">
      <ClipboardList className="w-12 h-12 text-text-secondary mx-auto mb-4" />
      <h3 className="text-h3 font-semibold text-text mb-2">Assignments</h3>
      <p className="text-body text-text-secondary">
        Assignment management feature coming soon.
      </p>
    </div>
  );
}

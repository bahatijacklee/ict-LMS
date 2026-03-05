'use client';

import { getFullName } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();

  const mockMetrics = {
    activeCourses: 3,
    feesOwed: 5000,
    attendancePercentage: 92,
    upcomingDeadlines: 2,
  };

  return (
    <div className="p-md lg:p-lg space-y-lg">
      {/* Header */}
      <div className="space-y-base">
        <h1 className="text-h1 font-bold">
          Welcome back, {user?.first_name}! 👋
        </h1>
        <p className="text-neutral-600">
          Today is {new Date().toLocaleDateString('en-KE', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* Alert Banner */}
      {mockMetrics.feesOwed > 0 && (
        <div className="p-md bg-error-light border-l-4 border-error rounded-lg flex items-start gap-base">
          <AlertCircle size={24} className="text-error flex-shrink-0 mt-xs" />
          <div>
            <p className="font-semibold text-error">Fees Outstanding</p>
            <p className="text-sm text-neutral-600">
              You have Ksh {mockMetrics.feesOwed.toLocaleString()} pending. Please make a payment to avoid late fees.
            </p>
            <button className="mt-base text-sm font-semibold text-error hover:text-error-dark">
              Pay Now →
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        {/* Active Courses */}
        <div className="bg-white rounded-lg p-lg shadow-md border border-neutral-200 space-y-base">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-small text-neutral-600">Active Courses</p>
              <p className="text-2xl font-bold text-neutral-900">
                {mockMetrics.activeCourses}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-brand-light flex items-center justify-center">
              <BookOpen size={24} className="text-brand" />
            </div>
          </div>
          <p className="text-small text-neutral-600">You're enrolled in 3 courses</p>
        </div>

        {/* Fees Owed */}
        <div className="bg-white rounded-lg p-lg shadow-md border border-neutral-200 space-y-base">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-small text-neutral-600">Fees Outstanding</p>
              <p className="text-2xl font-bold text-error">
                Ksh {mockMetrics.feesOwed.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-error-light flex items-center justify-center">
              <DollarSign size={24} className="text-error" />
            </div>
          </div>
          <button className="text-small font-semibold text-error hover:text-error-dark">
            Pay Now →
          </button>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-lg p-lg shadow-md border border-neutral-200 space-y-base">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-small text-neutral-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-success">
                {mockMetrics.attendancePercentage}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-success-light flex items-center justify-center">
              <CheckCircle size={24} className="text-success" />
            </div>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div
              className="bg-success h-2 rounded-full"
              style={{ width: `${mockMetrics.attendancePercentage}%` }}
            />
          </div>
        </div>

        {/* Deadlines */}
        <div className="bg-white rounded-lg p-lg shadow-md border border-neutral-200 space-y-base">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-small text-neutral-600">Upcoming Due</p>
              <p className="text-2xl font-bold text-neutral-900">
                {mockMetrics.upcomingDeadlines}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-warning-light flex items-center justify-center">
              <AlertCircle size={24} className="text-warning" />
            </div>
          </div>
          <p className="text-small text-neutral-600">2 assignments due this week</p>
        </div>
      </div>

      {/* My Courses Section */}
      <div className="bg-white rounded-lg p-lg shadow-md border border-neutral-200 space-y-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-h2 font-bold">My Courses</h2>
          <a href="/student/courses" className="text-brand hover:text-brand-dark font-semibold">
            View All →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="p-md border border-neutral-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="space-y-base">
                <h3 className="font-semibold">Web Development 101</h3>
                <p className="text-small text-neutral-600">Mr. Kipchoge</p>
                <div className="flex items-center justify-between pt-base">
                  <div className="text-small">
                    <p className="text-neutral-600">Progress</p>
                    <p className="font-semibold">60% Complete</p>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-brand-light flex items-center justify-center">
                    <span className="text-sm font-bold text-brand">60%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="bg-brand-light rounded-lg p-lg border border-brand grid md:grid-cols-2 gap-lg">
        <div>
          <h3 className="font-semibold text-brand mb-base">Getting Started</h3>
          <ul className="space-y-sm text-sm text-neutral-700">
            <li>✓ Complete your profile</li>
            <li>✓ Download course materials</li>
            <li>✓ Pay outstanding fees</li>
            <li>✓ Submit assignments on time</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-brand mb-base">Need Help?</h3>
          <p className="text-sm text-neutral-700 mb-base">
            Check out our knowledge base or contact support.
          </p>
          <button className="text-brand hover:text-brand-dark font-semibold text-sm">
            Contact Support →
          </button>
        </div>
      </div>
    </div>
  );
}

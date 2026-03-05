/**
 * Fees & Payments Page
 * Display fee breakdown and payment history
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  DollarSign,
  Clock,
  CheckCircle,
  FileText,
  TrendingDown,
  Calendar,
  Plus,
} from 'lucide-react';
import { useMyEnrollments } from '@/hooks/useEnrollments';
import { useMyPayments } from '@/hooks/usePayments';
import { Skeleton } from '@/components/shared/Skeleton';
import EmptyState from '@/components/shared/EmptyState';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import type { Enrollment, Payment } from '@/types';

export default function FeesPage() {
  const { data: enrollments, isLoading: loadingEnrollments } = useMyEnrollments();
  const { data: payments, isLoading: loadingPayments } = useMyPayments();

  // Calculate totals
  const totalFees = enrollments?.reduce(
    (sum: number, e: Enrollment) => sum + Number(e.course.fee),
    0
  ) || 0;

  const totalPaid = payments?.reduce(
    (sum: number, p: Payment) => sum + Number(p.amount_paid),
    0
  ) || 0;

  const totalBalance = enrollments?.reduce(
    (sum: number, e: Enrollment) => sum + Number(e.balance),
    0
  ) || 0;

  const isLoading = loadingEnrollments || loadingPayments;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-h1 font-bold text-text mb-2">Fees & Payments</h1>
        <p className="text-body text-text-secondary">
          View your fee breakdown, payment history, and make new payments
        </p>
      </div>

      {/* Summary Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Fees */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-label text-text-secondary">Total Fees</p>
                <p className="text-h2 font-bold text-text">{formatCurrency(totalFees)}</p>
              </div>
            </div>
            <p className="text-small text-text-secondary">
              Total course fees for {enrollments?.length || 0} enrollment(s)
            </p>
          </div>

          {/* Total Paid */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-label text-text-secondary">Total Paid</p>
                <p className="text-h2 font-bold text-success">{formatCurrency(totalPaid)}</p>
              </div>
            </div>
            <p className="text-small text-text-secondary">
              {payments?.length || 0} payment(s) made
            </p>
          </div>

          {/* Outstanding Balance */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-lg ${totalBalance > 0 ? 'bg-error/10' : 'bg-success/10'} flex items-center justify-center`}>
                {totalBalance > 0 ? (
                  <TrendingDown className="w-6 h-6 text-error" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-success" />
                )}
              </div>
              <div>
                <p className="text-label text-text-secondary">Outstanding</p>
                <p className={`text-h2 font-bold ${totalBalance > 0 ? 'text-error' : 'text-success'}`}>
                  {formatCurrency(totalBalance)}
                </p>
              </div>
            </div>
            {totalBalance > 0 ? (
              <Link
                href="/student/fees/payment"
                className="inline-flex items-center gap-2 text-small font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Make Payment
              </Link>
            ) : (
              <p className="text-small text-text-secondary">All fees paid!</p>
            )}
          </div>
        </div>
      )}

      {/* Fee Breakdown by Course */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-h2 font-semibold text-text">Fee Breakdown by Course</h2>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : enrollments && enrollments.length > 0 ? (
            <div className="space-y-4">
              {enrollments.map((enrollment: Enrollment) => (
                <div
                  key={enrollment.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gray-50 rounded-lg gap-4"
                >
                  <div className="flex-1">
                    <h3 className="text-body font-semibold text-text mb-1">
                      {enrollment.course.name}
                    </h3>
                    <p className="text-small text-text-secondary">
                      {enrollment.course.course_code}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-label text-text-secondary mb-1">Total Fee</p>
                      <p className="text-body font-semibold text-text">
                        {formatCurrency(enrollment.course.fee)}
                      </p>
                    </div>
                    <div>
                      <p className="text-label text-text-secondary mb-1">Paid</p>
                      <p className="text-body font-semibold text-success">
                        {formatCurrency(Number(enrollment.course.fee) - Number(enrollment.balance))}
                      </p>
                    </div>
                    <div>
                      <p className="text-label text-text-secondary mb-1">Balance</p>
                      <p className={`text-body font-semibold ${Number(enrollment.balance) > 0 ? 'text-error' : 'text-success'}`}>
                        {formatCurrency(enrollment.balance)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="No enrollments"
              description="You don't have any course enrollments yet."
            />
          )}
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-h2 font-semibold text-text">Payment History</h2>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : payments && payments.length > 0 ? (
            <div className="space-y-3">
              {payments.map((payment: Payment) => (
                <div
                  key={payment.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg ${
                      payment.status === 'VERIFIED'
                        ? 'bg-success/10'
                        : payment.status === 'PENDING'
                        ? 'bg-orange/10'
                        : 'bg-error/10'
                    } flex items-center justify-center flex-shrink-0`}>
                      {payment.status === 'VERIFIED' ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : payment.status === 'PENDING' ? (
                        <Clock className="w-5 h-5 text-orange" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-error" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-body font-semibold text-text">
                          {formatCurrency(payment.amount_paid)}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-label font-medium ${
                          payment.status === 'VERIFIED'
                            ? 'bg-success/10 text-success'
                            : payment.status === 'PENDING'
                            ? 'bg-orange/10 text-orange'
                            : 'bg-error/10 text-error'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                      <p className="text-small text-text-secondary mb-1">
                        {payment.enrollment?.course?.name || 'Unknown Course'}
                      </p>
                      <div className="flex items-center gap-4 text-small text-text-secondary">
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5" />
                          {payment.method}
                        </span>
                        {payment.transaction_ref && (
                          <span>Ref: {payment.transaction_ref}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex md:flex-col items-end gap-2 md:gap-1 text-small text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(payment.payment_date)}
                    </span>
                    {payment.verified_at && (
                      <span className="text-success">
                        Verified {formatDate(payment.verified_at)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CreditCard}
              title="No payments yet"
              description="You haven't made any payments. Make your first payment to get started."
              actionLabel={totalBalance > 0 ? "Make Payment" : undefined}
              onAction={totalBalance > 0 ? () => window.location.href = '/student/fees/payment' : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Make Payment Page
 * 3-step payment wizard
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Smartphone,
  Building2,
  FileText,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useMyEnrollments } from '@/hooks/useEnrollments';
import { useCreatePayment } from '@/hooks/usePayments';
import { Skeleton } from '@/components/shared/Skeleton';
import { formatCurrency } from '@/lib/utils';
import type { Enrollment } from '@/types';

type PaymentMethod = 'M_PESA' | 'BANK' | 'CASH' | 'CHEQUE';
type Step = 1 | 2 | 3;

export default function MakePaymentPage() {
  const [step, setStep] = useState<Step>(1);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod | ''>('');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');

  const { data: enrollments, isLoading } = useMyEnrollments();
  const createPayment = useCreatePayment();

  // Filter enrollments with outstanding balance
  const enrollmentsWithBalance = enrollments?.filter(
    (e: Enrollment) => Number(e.balance) > 0
  ) || [];

  const selectedEnrollment = enrollments?.find(
    (e: Enrollment) => e.id === selectedEnrollmentId
  );

  const handleSubmit = async () => {
    if (!selectedEnrollmentId || !amount || !method) return;

    try {
      await createPayment.mutateAsync({
        enrollment: selectedEnrollmentId,
        amount: Number(amount),
        method,
        transaction_ref: transactionRef || undefined,
        notes: notes || undefined,
      });

      setStep(3); // Success step
    } catch (error) {
      console.error('Payment submission failed:', error);
    }
  };

  const paymentMethods = [
    { key: 'M_PESA' as PaymentMethod, label: 'M-Pesa', icon: Smartphone, description: 'Mobile money payment' },
    { key: 'BANK' as PaymentMethod, label: 'Bank Transfer', icon: Building2, description: 'Direct bank transfer' },
    { key: 'CASH' as PaymentMethod, label: 'Cash', icon: CreditCard, description: 'Pay at office' },
    { key: 'CHEQUE' as PaymentMethod, label: 'Cheque', icon: FileText, description: 'Bank cheque' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/student/fees"
        className="inline-flex items-center gap-2 text-body text-text-secondary hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Fees
      </Link>

      {/* Header */}
      <div className="text-center">
        <h1 className="text-h1 font-bold text-text mb-2">Make Payment</h1>
        <p className="text-body text-text-secondary">
          Complete the steps below to submit your payment
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 pb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= s
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-text-secondary'
              }`}
            >
              {s < step || (step === 3 && s === 3) ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                s
              )}
            </div>
            <span className={`text-small ${step >= s ? 'text-text' : 'text-text-secondary'}`}>
              {s === 1 ? 'Select Course' : s === 2 ? 'Payment Details' : 'Confirmation'}
            </span>
            {s < 3 && (
              <div className={`w-12 h-0.5 ${step > s ? 'bg-primary' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-h2 font-semibold text-text mb-2">
                Step 1: Select Course
              </h2>
              <p className="text-body text-text-secondary">
                Choose the course you want to make payment for
              </p>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : enrollmentsWithBalance.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                <h3 className="text-h3 font-semibold text-text mb-2">
                  All Fees Paid!
                </h3>
                <p className="text-body text-text-secondary mb-6">
                  You don't have any outstanding balances.
                </p>
                <Link
                  href="/student/fees"
                  className="inline-block px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  View Payment History
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {enrollmentsWithBalance.map((enrollment: Enrollment) => (
                  <label
                    key={enrollment.id}
                    className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedEnrollmentId === enrollment.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="enrollment"
                        value={enrollment.id}
                        checked={selectedEnrollmentId === enrollment.id}
                        onChange={(e) => setSelectedEnrollmentId(e.target.value)}
                        className="w-5 h-5 text-primary"
                      />
                      <div>
                        <h3 className="text-body font-semibold text-text mb-1">
                          {enrollment.course.name}
                        </h3>
                        <p className="text-small text-text-secondary">
                          {enrollment.course.course_code}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-label text-text-secondary mb-1">
                        Outstanding
                      </p>
                      <p className="text-body font-bold text-error">
                        {formatCurrency(enrollment.balance)}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {enrollmentsWithBalance.length > 0 && (
              <button
                onClick={() => setStep(2)}
                disabled={!selectedEnrollmentId}
                className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Payment Details
              </button>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-h2 font-semibold text-text mb-2">
                Step 2: Payment Details
              </h2>
              <p className="text-body text-text-secondary">
                Enter payment amount and select method
              </p>
            </div>

            {/* Selected Course Summary */}
            {selectedEnrollment && (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-body font-semibold text-text mb-1">
                      {selectedEnrollment.course.name}
                    </p>
                    <p className="text-small text-text-secondary">
                      Outstanding: {formatCurrency(selectedEnrollment.balance)}
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-small text-primary hover:text-primary/80 font-medium"
                  >
                    Change Course
                  </button>
                </div>
              </div>
            )}

            {/* Amount Input */}
            <div>
              <label className="block text-body font-medium text-text mb-2">
                Payment Amount *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                  KES
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  max={selectedEnrollment?.balance}
                  className="w-full pl-16 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>
              {selectedEnrollment && Number(amount) > Number(selectedEnrollment.balance) && (
                <p className="mt-2 flex items-center gap-2 text-small text-error">
                  <AlertCircle className="w-4 h-4" />
                  Amount exceeds outstanding balance
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-body font-medium text-text mb-3">
                Payment Method *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {paymentMethods.map((pm) => {
                  const Icon = pm.icon;
                  return (
                    <label
                      key={pm.key}
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        method === pm.key
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="method"
                        value={pm.key}
                        checked={method === pm.key}
                        onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                        className="w-5 h-5 text-primary"
                      />
                      <Icon className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-body font-semibold text-text">
                          {pm.label}
                        </p>
                        <p className="text-small text-text-secondary">
                          {pm.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Transaction Reference (optional) */}
            <div>
              <label className="block text-body font-medium text-text mb-2">
                Transaction Reference (Optional)
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g., M-Pesa code or bank reference"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Notes (optional) */}
            <div>
              <label className="block text-body font-medium text-text mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information..."
                rows={3}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3 bg-gray-100 text-text rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  !amount ||
                  !method ||
                  Number(amount) <= 0 ||
                  (selectedEnrollment && Number(amount) > Number(selectedEnrollment.balance)) ||
                  createPayment.isPending
                }
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {createPayment.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Payment'
                )}
              </button>
            </div>

            {createPayment.isError && (
              <div className="p-4 bg-error/10 border border-error/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-body font-medium text-error mb-1">
                    Payment Submission Failed
                  </p>
                  <p className="text-small text-error/80">
                    There was an error submitting your payment. Please try again or contact support.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-h2 font-bold text-text mb-2">
              Payment Submitted Successfully!
            </h2>
            <p className="text-body text-text-secondary mb-8 max-w-md mx-auto">
              Your payment has been submitted and is pending verification. You will be notified once it's confirmed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/student/fees"
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                View Payment History
              </Link>
              <Link
                href="/student/dashboard"
                className="px-6 py-2.5 bg-gray-100 text-text rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

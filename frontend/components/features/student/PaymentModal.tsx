/**
 * Payment Modal - Student Payment Form
 * Phase 4 Feature Modal
 */

'use client';

import React, { useState } from 'react';
import { FormModal } from '@/components/shared/Modal';
import { useCreatePayment } from '@/hooks/usePayments';
import type { PaymentMethod } from '@/types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrollmentId: string;
  amountDue: number;
  studentName: string;
  courseName: string;
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string; description: string }[] = [
  { value: 'M_PESA', label: 'M-Pesa', description: 'Mobile money payment' },
  { value: 'BANK', label: 'Bank Transfer', description: 'Direct bank deposit' },
  { value: 'CASH', label: 'Cash', description: 'In-person payment' },
  { value: 'CHEQUE', label: 'Cheque', description: 'Post-dated cheque' },
];

export function PaymentModal({
  isOpen,
  onClose,
  enrollmentId,
  amountDue,
  studentName,
  courseName,
}: PaymentModalProps) {
  const [formData, setFormData] = useState({
    amount: amountDue,
    method: 'M_PESA' as PaymentMethod,
    transactionRef: '',
    notes: '',
  });
  const [error, setError] = useState<string | null>(null);

  const createPayment = useCreatePayment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (formData.amount > amountDue) {
      setError(`Amount cannot exceed Ksh ${amountDue.toLocaleString()}`);
      return;
    }

    try {
      await createPayment.mutateAsync({
        enrollment: enrollmentId,
        amount: formData.amount,
        method: formData.method,
        transaction_ref: formData.transactionRef || undefined,
        notes: formData.notes || undefined,
      });

      setFormData({
        amount: amountDue,
        method: 'M_PESA',
        transactionRef: '',
        notes: '',
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Payment failed. Please try again.');
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData(prev => ({ ...prev, amount: value }));
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Make Payment"
      description={`Pay for ${courseName} course`}
      submitText="Submit Payment"
      isSubmitting={createPayment.isPending}
      size="md"
    >
      {/* Amount Summary */}
      <div className="bg-brand-light rounded-lg p-lg mb-lg">
        <p className="text-small text-neutral-600 mb-base">Amount Due</p>
        <p className="text-h2 font-bold text-neutral-900">
          Ksh {amountDue.toLocaleString()}
        </p>
        <p className="text-small text-neutral-600 mt-base">
          Student: {studentName}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-lg p-md bg-error-light border border-error rounded-lg">
          <p className="text-small text-error">{error}</p>
        </div>
      )}

      {/* Payment Amount */}
      <div className="mb-lg">
        <label htmlFor="amount" className="block text-small font-semibold text-neutral-900 mb-base">
          Payment Amount (Ksh)
        </label>
        <input
          id="amount"
          type="number"
          min="0"
          step="100"
          value={formData.amount}
          onChange={handleAmountChange}
          className="w-full px-md py-2 border border-neutral-200 rounded-md focus:ring-2 focus:ring-brand focus:border-transparent"
          required
        />
        <p className="text-small text-neutral-600 mt-base">
          Remaining: Ksh {Math.max(0, amountDue - formData.amount).toLocaleString()}
        </p>
      </div>

      {/* Payment Method */}
      <div className="mb-lg">
        <label htmlFor="method" className="block text-small font-semibold text-neutral-900 mb-base">
          Payment Method
        </label>
        <select
          id="method"
          value={formData.method}
          onChange={(e) =>
            setFormData(prev => ({ ...prev, method: e.target.value as PaymentMethod }))
          }
          className="w-full px-md py-2 border border-neutral-200 rounded-md focus:ring-2 focus:ring-brand focus:border-transparent"
        >
          {PAYMENT_METHODS.map(method => (
            <option key={method.value} value={method.value}>
              {method.label} - {method.description}
            </option>
          ))}
        </select>
      </div>

      {/* Transaction Reference (for online payments) */}
      {(['M_PESA', 'BANK'].includes(formData.method)) && (
        <div className="mb-lg">
          <label
            htmlFor="transactionRef"
            className="block text-small font-semibold text-neutral-900 mb-base"
          >
            Transaction Reference / Confirmation Number
          </label>
          <input
            id="transactionRef"
            type="text"
            placeholder="e.g., MPESA receipt number or bank transaction ID"
            value={formData.transactionRef}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, transactionRef: e.target.value }))
            }
            className="w-full px-md py-2 border border-neutral-200 rounded-md focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>
      )}

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-small font-semibold text-neutral-900 mb-base">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Add any notes about this payment..."
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          className="w-full px-md py-2 border border-neutral-200 rounded-md focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
        />
      </div>
    </FormModal>
  );
}

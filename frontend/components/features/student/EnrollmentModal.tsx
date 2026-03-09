/**
 * Enrollment Modal - Student Course Enrollment
 * Phase 4 Feature Modal
 */

'use client';

import React, { useState } from 'react';
import { FormModal } from '@/components/shared/Modal';
import { AlertCircle } from 'lucide-react';
import type { Batch } from '@/types';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: Batch | null;
  onEnroll: (enrollmentData: { batchId: string; notes?: string }) => Promise<void>;
  isLoading?: boolean;
}

export function EnrollmentModal({
  isOpen,
  onClose,
  batch,
  onEnroll,
  isLoading = false,
}: EnrollmentModalProps) {
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!batch) {
      setError('Course information is missing');
      return;
    }

    if (batch.current_students >= batch.max_students) {
      setError('This course is full. Please choose another course.');
      return;
    }

    try {
      await onEnroll({
        batchId: batch.id,
        notes: notes || undefined,
      });
      setNotes('');
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Enrollment failed. Please try again.'
      );
    }
  };

  if (!batch) return null;

  const availableSeats = batch.max_students - batch.current_students;
  const isFull = availableSeats <= 0;

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Enroll in Course"
      description="Complete your enrollment for this course"
      submitText="Confirm Enrollment"
      isSubmitting={isLoading}
      size="md"
    >
      {/* Course Information */}
      <div className="bg-brand-light rounded-lg p-lg mb-lg space-y-base">
        <div>
          <p className="text-small text-neutral-600">Course</p>
          <p className="text-h3 font-bold text-neutral-900">
            {typeof batch.course === 'string' ? batch.course : batch.course?.name}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-md">
          <div>
            <p className="text-small text-neutral-600">Batch</p>
            <p className="text-body font-semibold text-neutral-900">{batch.name}</p>
          </div>
          <div>
            <p className="text-small text-neutral-600">Instructor</p>
            <p className="text-body font-semibold text-neutral-900">
              {typeof batch.instructor === 'string'
                ? batch.instructor
                : batch.instructor?.first_name}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-md">
          <div>
            <p className="text-small text-neutral-600">Start Date</p>
            <p className="text-body font-semibold text-neutral-900">
              {new Date(batch.start_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-small text-neutral-600">End Date</p>
            <p className="text-body font-semibold text-neutral-900">
              {new Date(batch.end_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Availability Warning */}
      {isFull && (
        <div className="mb-lg p-md bg-error-light border border-error rounded-lg flex items-start gap-base">
          <AlertCircle size={20} className="text-error flex-shrink-0 mt-xs" />
          <div>
            <p className="text-small font-semibold text-error">Course Full</p>
            <p className="text-small text-error">
              This course has reached maximum capacity. Please contact support to join waitlist.
            </p>
          </div>
        </div>
      )}

      {/* Availability Info */}
      <div className="mb-lg p-md bg-neutral-100 rounded-lg">
        <p className="text-small text-neutral-600 mb-base">Available Seats</p>
        <div className="flex items-center justify-between">
          <p className="text-h2 font-bold text-neutral-900">{availableSeats}</p>
          <p className="text-small text-neutral-600">
            {batch.current_students} / {batch.max_students} enrolled
          </p>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2 mt-base">
          <div
            className="bg-brand h-2 rounded-full transition-all"
            style={{
              width: `${(batch.current_students / batch.max_students) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-lg p-md bg-error-light border border-error rounded-lg">
          <p className="text-small text-error">{error}</p>
        </div>
      )}

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-small font-semibold text-neutral-900 mb-base">
          Enrollment Notes (Optional)
        </label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Add any notes about your enrollment..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-md py-2 border border-neutral-200 rounded-md focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
          disabled={isFull}
        />
      </div>

      {/* Terms */}
      <div className="mt-lg p-md bg-neutral-100 rounded-lg">
        <p className="text-small text-neutral-600">
          By enrolling, you agree to the course terms and conditions. Course fees will be charged to your account.
        </p>
      </div>
    </FormModal>
  );
}

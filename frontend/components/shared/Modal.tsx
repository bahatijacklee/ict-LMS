/**
 * Modal Component - Phase 4 Enhancement
 * Base modal with backdrop, focus trap, keyboard handling
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeButton?: boolean;
  className?: string;
}

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

/**
 * Base Modal Component
 * Handles backdrop, focus trap, keyboard escape, animations
 *
 * @example
 * <Modal isOpen={isOpen} onClose={onClose} title="Confirm Action">
 *   <p>Are you sure?</p>
 * </Modal>
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeButton = true,
  className,
}: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const focusTrapRef = useFocusTrap({ isActive: isOpen });

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === backdropRef.current) {
      onClose();
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={handleBackdropClick}
      aria-hidden="true"
    >
      <div
        ref={focusTrapRef}
        className={cn(
          'relative w-full mx-md bg-white rounded-lg shadow-lg animate-slide-up',
          sizeClasses[size],
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        {/* Close Button */}
        {closeButton && (
          <button
            onClick={onClose}
            className="absolute top-md right-md p-sm hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X size={20} className="text-neutral-600" />
          </button>
        )}

        {/* Header */}
        {(title || description) && (
          <div className="p-lg border-b border-neutral-200">
            {title && (
              <h2
                id="modal-title"
                className="text-h2 font-bold text-neutral-900"
              >
                {title}
              </h2>
            )}
            {description && (
              <p id="modal-description" className="text-body text-neutral-600 mt-base">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-lg">{children}</div>
      </div>
    </div>
  );
}

/**
 * Modal Variants - Commonly used patterns
 */

export function AlertModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} description={description} size="sm">
      <div className="flex gap-md justify-end pt-lg">
        <button
          onClick={onClose}
          className="btn btn-secondary"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className={isDangerous ? 'btn btn-danger' : 'btn btn-primary'}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}

/**
 * Form Modal - For forms with submit/cancel buttons
 */
export function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  children,
  submitText = 'Submit',
  cancelText = 'Cancel',
  isSubmitting = false,
  size = 'md',
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  isSubmitting?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size={size}
    >
      <form onSubmit={onSubmit} className="space-y-lg">
        {children}
        <div className="flex gap-md justify-end pt-lg border-t border-neutral-200">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            {cancelText}
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : submitText}
          </button>
        </div>
      </form>
    </Modal>
  );
}

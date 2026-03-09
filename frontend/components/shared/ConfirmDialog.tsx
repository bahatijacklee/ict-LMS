/**
 * Confirm Dialog Component
 * Reusable confirmation dialog for dangerous or important actions
 */

'use client';

import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/shared/Modal';
import { DialogFooter } from '@/components/shared/DialogFooter';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  icon?: 'alert' | 'warning' | 'info';
}

const iconMap = {
  alert: { Icon: AlertCircle, color: 'bg-error-light', iconColor: 'text-error' },
  warning: { Icon: AlertTriangle, color: 'bg-warning-light', iconColor: 'text-warning' },
  info: { Icon: AlertCircle, color: 'bg-brand-light', iconColor: 'text-brand' },
};

/**
 * Confirm Dialog Component
 *
 * @example
 * <ConfirmDialog
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   onConfirm={handleDelete}
 *   title="Delete Course?"
 *   message="This action cannot be undone."
 *   confirmText="Delete"
 *   isDangerous={true}
 * />
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  isLoading = false,
  icon = 'alert',
}: ConfirmDialogProps) {
  const { Icon, color, iconColor } = iconMap[icon];

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      closeButton={!isLoading}
    >
      {/* Icon */}
      <div className="flex justify-center mb-lg pt-lg">
        <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center`}>
          <Icon size={32} className={iconColor} />
        </div>
      </div>

      {/* Content */}
      <div className="text-center px-lg pb-lg">
        <h2 className="text-h2 font-bold text-neutral-900 mb-base">{title}</h2>
        <p className="text-body text-neutral-600 mb-lg">{message}</p>
        {description && (
          <p className="text-small text-neutral-500 mb-lg">{description}</p>
        )}
      </div>

      {/* Actions */}
      <DialogFooter align="center" className="gap-lg">
        <button
          onClick={onClose}
          className="btn btn-secondary"
          disabled={isLoading}
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          className={isDangerous ? 'btn btn-danger' : 'btn btn-primary'}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : confirmText}
        </button>
      </DialogFooter>
    </Modal>
  );
}

/**
 * Delete Confirm Dialog - Specialized for delete operations
 */
export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isLoading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  itemName: string;
  isLoading?: boolean;
}) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Permanently?"
      message={`Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
      confirmText="Delete"
      isDangerous={true}
      isLoading={isLoading}
      icon="warning"
    />
  );
}

/**
 * Logout Confirm Dialog
 */
export function LogoutConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
}) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Sign Out?"
      message="You will be logged out of your account."
      description="You can sign back in anytime."
      confirmText="Sign Out"
      icon="info"
      isLoading={isLoading}
    />
  );
}

/**
 * Leave Form Dialog - For unsaved changes
 */
export function LeaveFormDialog({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Discard Changes?"
      message="You have unsaved changes. Are you sure you want to leave?"
      description="Your changes will be lost."
      confirmText="Discard"
      cancelText="Keep Editing"
      icon="warning"
      isDangerous={true}
    />
  );
}

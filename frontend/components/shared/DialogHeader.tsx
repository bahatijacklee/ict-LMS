/**
 * Dialog Header Component
 * Reusable header for modals with title, description, close button
 */

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialogHeaderProps {
  title?: string;
  description?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
  className?: string;
}

export function DialogHeader({
  title,
  description,
  onClose,
  showCloseButton = true,
  className,
}: DialogHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-start justify-between p-lg border-b border-neutral-200',
        className
      )}
    >
      <div className="flex-1">
        {title && (
          <h2 className="text-h2 font-bold text-neutral-900">{title}</h2>
        )}
        {description && (
          <p className="text-body text-neutral-600 mt-base">{description}</p>
        )}
      </div>
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-sm hover:bg-neutral-100 rounded-lg transition-colors ml-md"
          aria-label="Close dialog"
        >
          <X size={20} className="text-neutral-600" />
        </button>
      )}
    </div>
  );
}

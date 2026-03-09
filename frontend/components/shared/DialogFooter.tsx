/**
 * Dialog Footer Component
 * Reusable footer for modals with action buttons
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

const alignClasses = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

export function DialogFooter({
  children,
  className,
  align = 'right',
}: DialogFooterProps) {
  return (
    <div
      className={cn(
        'flex gap-md p-lg border-t border-neutral-200',
        alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * StepCard - How It Works Step Card
 * Used in the "How It Works" section journey
 * Shows step number + icon + title + description
 */

import { LucideIcon } from 'lucide-react';

interface StepCardProps {
  stepNumber: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

export function StepCard({
  stepNumber,
  icon: Icon,
  title,
  description,
}: StepCardProps) {
  return (
    <div className="space-y-base text-center">
      {/* Step Badge */}
      <div className="flex justify-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-brand-light border-2 border-brand text-brand font-bold text-lg">
          {stepNumber}
        </div>
      </div>

      {/* Icon */}
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light">
          <Icon size={32} className="text-brand" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-h3 font-bold text-neutral-900">{title}</h3>

      {/* Description */}
      <p className="text-sm text-neutral-600 max-w-xs">{description}</p>
    </div>
  );
}

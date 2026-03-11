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
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-brand to-brand-dark border-2 border-brand text-white font-bold text-xl shadow-lg">
          {stepNumber}
        </div>
      </div>

      {/* Icon */}
      <div className="flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-light border-2 border-brand/30 shadow-sm">
          <Icon size={36} className="text-brand" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-neutral-900">{title}</h3>

      {/* Description */}
      <p className="text-sm text-neutral-600 max-w-xs leading-relaxed">{description}</p>
    </div>
  );
}

/**
 * BenefitCard - Key Benefits Grid Card
 * Used in the "Why Students Love Baptist ICT" section
 * Shows icon + title + description
 */

import { LucideIcon } from 'lucide-react';

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function BenefitCard({
  icon: Icon,
  title,
  description,
}: BenefitCardProps) {
  return (
    <div className="rounded-lg bg-neutral-50 p-lg transition-colors duration-220 hover:bg-neutral-100">
      {/* Icon */}
      <div className="mb-base flex h-12 w-12 items-center justify-center rounded-lg bg-brand-light">
        <Icon size={24} className="text-brand" />
      </div>

      {/* Title */}
      <h4 className="mb-base text-lg font-semibold text-neutral-900">{title}</h4>

      {/* Description */}
      <p className="text-sm text-neutral-600 leading-relaxed">{description}</p>
    </div>
  );
}

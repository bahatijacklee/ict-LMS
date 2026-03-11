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
    <div className="group rounded-lg bg-neutral-50 p-lg border border-neutral-200/50 transition-all duration-260 hover:bg-brand-light/40 hover:border-brand/30 hover:shadow-md">
      {/* Icon */}
      <div className="mb-base flex h-14 w-14 items-center justify-center rounded-lg bg-brand-light border border-brand/20 group-hover:border-brand/50 transition-colors duration-260">
        <Icon size={28} className="text-brand" />
      </div>

      {/* Title */}
      <h4 className="mb-base text-lg font-semibold text-neutral-900">{title}</h4>

      {/* Description */}
      <p className="text-sm text-neutral-600 leading-relaxed">{description}</p>
    </div>
  );
}

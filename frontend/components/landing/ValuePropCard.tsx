/**
 * ValuePropCard - Landing Page Value Proposition Card
 * Used in the "Why Baptist ICT?" section
 * Shows icon + title + description + learn more link
 */

import { LucideIcon, ArrowRight } from 'lucide-react';

interface ValuePropCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
}

export function ValuePropCard({
  icon: Icon,
  title,
  description,
  href = '#',
}: ValuePropCardProps) {
  return (
    <div className="group rounded-xl border border-neutral-200 bg-white p-lg shadow-sm transition-all duration-260 hover:shadow-md hover:border-brand/20 card-hover">
      {/* Icon Container */}
      <div className="mb-lg flex h-12 w-12 items-center justify-center rounded-lg bg-brand-light">
        <Icon size={24} className="text-brand" />
      </div>

      {/* Title */}
      <h3 className="mb-base text-h3 font-bold text-neutral-900">{title}</h3>

      {/* Description */}
      <p className="mb-lg text-body text-neutral-600">{description}</p>

      {/* Learn More Link */}
      <a
        href={href}
        className="inline-flex items-center gap-sm text-sm font-semibold text-brand opacity-80 transition-all group-hover:gap-base group-hover:opacity-100"
      >
        Learn more
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

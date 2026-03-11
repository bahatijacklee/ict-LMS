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
    <div className="group rounded-xl border-2 border-neutral-200 bg-white p-lg shadow-sm transition-all duration-260 hover:shadow-lg hover:border-brand/40 hover:bg-brand-light/30 card-hover">
      {/* Icon Container */}
      <div className="mb-lg flex h-14 w-14 items-center justify-center rounded-lg bg-brand-light border border-brand/20 group-hover:border-brand/50 transition-colors duration-260">
        <Icon size={28} className="text-brand" />
      </div>

      {/* Title */}
      <h3 className="mb-base text-h3 font-bold text-neutral-900">{title}</h3>

      {/* Description */}
      <p className="mb-lg text-sm text-neutral-600 leading-relaxed">{description}</p>

      {/* Learn More Link */}
      <a
        href={href}
        className="inline-flex items-center gap-sm text-sm font-semibold text-brand opacity-90 transition-all group-hover:gap-base group-hover:opacity-100"
      >
        Learn more
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

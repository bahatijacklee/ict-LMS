/**
 * ResourceCard - Getting Started Resource Card
 * Used in the "Everything You Need" section
 * Shows icon + title + description + link
 */

import { LucideIcon, ArrowRight } from 'lucide-react';

interface ResourceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  linkText: string;
  href?: string;
}

export function ResourceCard({
  icon: Icon,
  title,
  description,
  linkText,
  href = '#',
}: ResourceCardProps) {
  return (
    <div className="group rounded-lg border-2 border-neutral-200 bg-white p-lg transition-all duration-260 hover:border-brand/40 hover:shadow-lg hover:bg-brand-light/20">
      {/* Icon */}
      <div className="mb-base flex h-14 w-14 items-center justify-center rounded-lg bg-brand-light border border-brand/20 group-hover:border-brand/50 transition-colors duration-260">
        <Icon size={28} className="text-brand" />
      </div>

      {/* Title */}
      <h4 className="mb-base text-lg font-semibold text-neutral-900">{title}</h4>

      {/* Description */}
      <p className="mb-lg text-sm text-neutral-600 leading-relaxed">{description}</p>

      {/* Link */}
      <a
        href={href}
        className="inline-flex items-center gap-sm text-sm font-semibold text-brand opacity-90 group-hover:opacity-100 group-hover:gap-base transition-all"
      >
        {linkText}
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

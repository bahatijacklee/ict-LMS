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
    <div className="rounded-lg border border-neutral-200 bg-white p-lg transition-all duration-220 hover:border-brand/20 hover:shadow-sm">
      {/* Icon */}
      <div className="mb-base flex h-12 w-12 items-center justify-center rounded-lg bg-brand-light">
        <Icon size={24} className="text-brand" />
      </div>

      {/* Title */}
      <h4 className="mb-base text-lg font-semibold text-neutral-900">{title}</h4>

      {/* Description */}
      <p className="mb-lg text-sm text-neutral-600">{description}</p>

      {/* Link */}
      <a
        href={href}
        className="inline-flex items-center gap-sm text-sm font-semibold text-brand hover:gap-base transition-all"
      >
        {linkText}
        <ArrowRight size={16} className="transition-transform" />
      </a>
    </div>
  );
}

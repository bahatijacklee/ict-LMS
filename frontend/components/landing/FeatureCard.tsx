/**
 * FeatureCard - Landing Page Feature Card (Student-Focused)
 * Used in the core features grid section
 * Shows image + title + description + learn more link
 */

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  href?: string;
}

export function FeatureCard({
  image,
  imageAlt,
  title,
  description,
  href = '#',
}: FeatureCardProps) {
  return (
    <article className="feature-card group rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-sm transition-all duration-260 hover:shadow-md hover:border-brand/20">
      {/* Feature Image */}
      <div className="relative h-48 w-full bg-neutral-100 overflow-hidden">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-lg space-y-base">
        {/* Title */}
        <h3 className="text-h3 font-bold text-neutral-900">{title}</h3>

        {/* Description */}
        <p className="text-body text-neutral-600">{description}</p>

        {/* Learn More Link */}
        <div className="pt-sm">
          <a
            href={href}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand opacity-80 transition-all hover:gap-3 hover:opacity-100"
          >
            Learn more
            <ArrowRight size={16} className="transition-transform hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

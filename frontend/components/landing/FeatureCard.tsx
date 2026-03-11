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
    <article className="feature-card group rounded-xl border-2 border-neutral-200 bg-white overflow-hidden shadow-md transition-all duration-260 hover:shadow-xl hover:border-brand/40">
      {/* Feature Image */}
      <div className="relative h-52 w-full bg-neutral-100 overflow-hidden">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-lg space-y-base">
        {/* Title */}
        <h3 className="text-lg font-bold text-neutral-900">{title}</h3>

        {/* Description */}
        <p className="text-sm text-neutral-600 leading-relaxed">{description}</p>

        {/* Learn More Link */}
        <div className="pt-base">
          <a
            href={href}
            className="inline-flex items-center gap-sm text-sm font-semibold text-brand opacity-90 transition-all group-hover:gap-base group-hover:opacity-100"
          >
            Learn more
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

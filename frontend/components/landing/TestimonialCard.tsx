/**
 * TestimonialCard - Student Success Story Testimonial
 * Used in the "Student Success Stories" section
 * Shows quote + student info + avatar + rating
 */

import Image from 'next/image';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  studentName: string;
  studentYear: string;
  studentMajor: string;
  avatarUrl: string;
  rating?: number;
}

export function TestimonialCard({
  quote,
  studentName,
  studentYear,
  studentMajor,
  avatarUrl,
  rating = 5,
}: TestimonialCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-brand-light p-lg shadow-sm">
      {/* Quote */}
      <p className="mb-lg text-body text-neutral-900 italic leading-relaxed">
        "{quote}"
      </p>

      {/* Student Info Row */}
      <div className="flex items-center gap-base">
        {/* Avatar */}
        <div className="relative h-12 w-12 flex-shrink-0">
          <Image
            src={avatarUrl}
            alt={studentName}
            fill
            className="rounded-full object-cover"
          />
        </div>

        {/* Name & Details */}
        <div className="flex-1">
          <p className="font-semibold text-neutral-900">{studentName}</p>
          <p className="text-sm text-neutral-600">
            {studentYear}, {studentMajor}
          </p>
        </div>
      </div>

      {/* Rating */}
      <div className="mt-lg flex gap-xs">
        {Array.from({ length: rating }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className="fill-accent text-accent"
          />
        ))}
      </div>
    </div>
  );
}

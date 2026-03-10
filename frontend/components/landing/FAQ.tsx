/**
 * FAQ Component - Expandable Q&A Section
 * Used in the landing page FAQ section
 */

'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

export function FAQ({ items }: FAQProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="space-y-base">
      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-lg border border-neutral-200 overflow-hidden"
        >
          <button
            onClick={() =>
              setExpandedIndex(expandedIndex === index ? null : index)
            }
            className="w-full flex items-center justify-between gap-lg p-lg bg-white hover:bg-neutral-50 transition-colors"
          >
            <h4 className="text-lg font-semibold text-neutral-900 text-left">
              {item.question}
            </h4>
            <ChevronDown
              size={20}
              className={`flex-shrink-0 text-brand transition-transform ${
                expandedIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Answer */}
          {expandedIndex === index && (
            <div className="border-t border-neutral-200 bg-neutral-50 p-lg animate-slide-up">
              <p className="text-neutral-600 leading-relaxed">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

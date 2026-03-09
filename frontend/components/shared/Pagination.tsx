/**
 * Pagination Component - Phase 5 Enhancement
 * Page navigation with previous/next and page numbers
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  itemsPerPage?: number;
  totalItems?: number;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
}

/**
 * Pagination Component
 * Displays page navigation with previous/next buttons and page numbers
 *
 * @example
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={setPage}
 *   totalItems={250}
 *   itemsPerPage={25}
 * />
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  itemsPerPage,
  totalItems,
  showPageNumbers = true,
  maxVisiblePages = 5,
}: PaginationProps) {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  // Calculate visible page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePrev = () => {
    if (hasPrev && !isLoading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNext && !isLoading) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage && !isLoading) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-between py-lg px-md">
      {/* Info Text */}
      <div className="text-small text-neutral-600">
        {totalItems && itemsPerPage ? (
          <>
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{' '}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
          </>
        ) : (
          `Page ${currentPage} of ${totalPages}`
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-base">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          disabled={!hasPrev || isLoading}
          className={cn(
            'p-base rounded-lg transition-colors',
            hasPrev && !isLoading
              ? 'hover:bg-neutral-100 cursor-pointer text-neutral-900'
              : 'text-neutral-400 cursor-not-allowed'
          )}
          aria-label="Previous page"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Page Numbers */}
        {showPageNumbers && (
          <div className="flex items-center gap-xs">
            {getPageNumbers().map((page, i) => (
              <button
                key={i}
                onClick={() => handlePageClick(page)}
                disabled={page === '...' || isLoading}
                className={cn(
                  'px-md py-base rounded-lg text-small font-medium transition-colors',
                  page === currentPage
                    ? 'bg-brand text-white'
                    : page === '...'
                    ? 'cursor-default text-neutral-600'
                    : 'hover:bg-neutral-100 text-neutral-900 cursor-pointer'
                )}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!hasNext || isLoading}
          className={cn(
            'p-base rounded-lg transition-colors',
            hasNext && !isLoading
              ? 'hover:bg-neutral-100 cursor-pointer text-neutral-900'
              : 'text-neutral-400 cursor-not-allowed'
          )}
          aria-label="Next page"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

/**
 * Simple Pagination - Minimal version with just prev/next
 */
export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-lg px-md">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="btn btn-secondary"
      >
        ← Previous
      </button>

      <span className="text-small text-neutral-600">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="btn btn-secondary"
      >
        Next →
      </button>
    </div>
  );
}

/**
 * Filter Bar Component - Phase 5 Enhancement
 * Search and filter controls for data display
 */

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  onSearch?: (query: string) => void;
  onFilter?: (filters: Record<string, string>) => void;
  placeholder?: string;
  filters?: Array<{
    id: string;
    label: string;
    options: Array<{ value: string; label: string }>;
  }>;
  searchDelay?: number;
  className?: string;
}

/**
 * Filter Bar Component
 * Combines search input with optional filter dropdowns
 *
 * @example
 * <FilterBar
 *   placeholder="Search payments..."
 *   onSearch={handleSearch}
 *   filters={[
 *     {
 *       id: 'status',
 *       label: 'Status',
 *       options: [
 *         { value: 'all', label: 'All' },
 *         { value: 'pending', label: 'Pending' },
 *       ]
 *     }
 *   ]}
 *   onFilter={handleFilter}
 * />
 */
export function FilterBar({
  onSearch,
  onFilter,
  placeholder = 'Search...',
  filters = [],
  searchDelay = 300,
  className,
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeout) clearTimeout(searchTimeout);

    const timeout = setTimeout(() => {
      onSearch?.(value);
    }, searchDelay);

    setSearchTimeout(timeout);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (searchTimeout) clearTimeout(searchTimeout);
    onSearch?.('');
  };

  const handleFilterChange = (filterId: string, value: string) => {
    const newFilters = { ...activeFilters, [filterId]: value };
    if (value === '') {
      delete newFilters[filterId];
    }
    setActiveFilters(newFilters);
    onFilter?.(newFilters);
  };

  const hasActiveFilters = Object.values(activeFilters).some(v => v !== '');

  return (
    <div className={cn('space-y-md', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search
          size={20}
          className="absolute left-md top-1/2 transform -translate-y-1/2 text-neutral-400"
        />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-2xl pr-md py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-md top-1/2 transform -translate-y-1/2 p-sm hover:bg-neutral-100 rounded transition-colors"
            aria-label="Clear search"
          >
            <X size={18} className="text-neutral-400" />
          </button>
        )}
      </div>

      {/* Filter Dropdowns */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-md items-center">
          {filters.map(filter => (
            <div key={filter.id} className="relative">
              <select
                value={activeFilters[filter.id] || ''}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                className="px-md py-2 border border-neutral-200 rounded-lg bg-white focus:ring-2 focus:ring-brand focus:border-transparent text-small"
                aria-label={filter.label}
              >
                <option value="">{filter.label}</option>
                {filter.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Clear All Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                setActiveFilters({});
                onFilter?.({});
              }}
              className="text-small text-brand hover:text-brand-dark font-semibold"
            >
              Clear All
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Quick Filter Chips
 * For simple single-option filtering
 */
interface QuickFilterProps {
  options: Array<{ value: string; label: string }>;
  activeValue?: string;
  onSelect?: (value: string) => void;
  className?: string;
}

export function QuickFilter({
  options,
  activeValue,
  onSelect,
  className,
}: QuickFilterProps) {
  return (
    <div className={cn('flex flex-wrap gap-base', className)}>
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onSelect?.(option.value)}
          className={cn(
            'px-md py-base rounded-full text-small font-medium transition-colors',
            activeValue === option.value
              ? 'bg-brand text-white'
              : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

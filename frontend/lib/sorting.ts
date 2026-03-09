/**
 * Sorting Utilities
 * Helper functions for sorting data
 */

export type SortOrder = 'asc' | 'desc';

/**
 * Compare function for sorting
 * Handles strings, numbers, dates, and null values
 */
export function compareValues(a: any, b: any, order: SortOrder = 'asc'): number {
  // Handle null/undefined
  if (a == null && b == null) return 0;
  if (a == null) return order === 'asc' ? 1 : -1;
  if (b == null) return order === 'asc' ? -1 : 1;

  // Handle numbers
  if (typeof a === 'number' && typeof b === 'number') {
    return order === 'asc' ? a - b : b - a;
  }

  // Handle dates
  if (a instanceof Date && b instanceof Date) {
    const diff = a.getTime() - b.getTime();
    return order === 'asc' ? diff : -diff;
  }

  // Handle strings
  if (typeof a === 'string' && typeof b === 'string') {
    const comparison = a.localeCompare(b);
    return order === 'asc' ? comparison : -comparison;
  }

  // Fallback: try to compare as strings
  const aStr = String(a).toLowerCase();
  const bStr = String(b).toLowerCase();
  const comparison = aStr.localeCompare(bStr);
  return order === 'asc' ? comparison : -comparison;
}

/**
 * Sort array by multiple columns
 */
export function sortBy<T>(
  data: T[],
  sortKey: string | null,
  order: SortOrder = 'asc'
): T[] {
  if (!sortKey) return data;

  return [...data].sort((a, b) => {
    const aValue = getNestedValue(a, sortKey);
    const bValue = getNestedValue(b, sortKey);
    return compareValues(aValue, bValue, order);
  });
}

/**
 * Get nested object value by dot notation path
 * e.g., "user.name" -> gets nested.user.name value
 */
export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

/**
 * Filter data by search query
 * Searches across multiple fields
 */
export function filterBySearch<T>(
  data: T[],
  query: string,
  searchFields: (keyof T)[]
): T[] {
  if (!query.trim()) return data;

  const lowerQuery = query.toLowerCase();
  return data.filter(item =>
    searchFields.some(field => {
      const value = String(item[field] ?? '').toLowerCase();
      return value.includes(lowerQuery);
    })
  );
}

/**
 * Filter data by multiple criteria
 */
export function filterByMultiple<T>(
  data: T[],
  filters: Record<string, any>
): T[] {
  return data.filter(item =>
    Object.entries(filters).every(([key, value]) => {
      if (!value) return true; // Skip empty filters
      const itemValue = getNestedValue(item, key);
      return itemValue === value;
    })
  );
}

/**
 * Pagination utilities
 */
export interface PaginationParams {
  currentPage: number;
  itemsPerPage: number;
}

export interface PaginatedResult<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
}

/**
 * Paginate array
 */
export function paginate<T>(
  data: T[],
  page: number,
  pageSize: number
): PaginatedResult<T> {
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number, currency: string = 'KES'): string {
  const formatter = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
  });
  return formatter.format(value);
}

/**
 * Format date for display
 */
export function formatDisplayDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

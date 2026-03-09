/**
 * Table Component - Phase 5 Enhancement
 * Semantic table with sorting, striped rows, hover states
 */

import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SortDirection = 'asc' | 'desc' | null;

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  onSort?: (column: string, direction: SortDirection) => void;
  sortColumn?: string;
  sortDirection?: SortDirection;
  striped?: boolean;
  hoverable?: boolean;
  className?: string;
  isLoading?: boolean;
  loadingRows?: number;
}

/**
 * Base Table Component
 *
 * @example
 * <Table
 *   columns={columns}
 *   data={payments}
 *   keyExtractor={(p) => p.id}
 *   sortColumn="date"
 *   sortDirection="desc"
 *   onSort={handleSort}
 *   striped={true}
 *   hoverable={true}
 * />
 */
export function Table<T = any>({
  columns,
  data,
  keyExtractor,
  onSort,
  sortColumn,
  sortDirection,
  striped = true,
  hoverable = true,
  className,
  isLoading = false,
  loadingRows = 5,
}: TableProps<T>) {
  const getAlignClass = (align?: string) => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  const handleHeaderClick = (column: TableColumn) => {
    if (!column.sortable || !onSort) return;

    let newDirection: SortDirection = 'asc';
    if (sortColumn === column.key && sortDirection === 'asc') {
      newDirection = 'desc';
    } else if (sortColumn === column.key && sortDirection === 'desc') {
      newDirection = null;
    }

    onSort(column.key, newDirection);
  };

  return (
    <div className={cn('w-full overflow-x-auto rounded-lg border border-neutral-200', className)}>
      <table className="w-full border-collapse">
        {/* Header */}
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-lg py-md font-semibold text-small text-neutral-900',
                  getAlignClass(column.align),
                  column.sortable && onSort && 'cursor-pointer hover:bg-neutral-100 select-none'
                )}
                style={column.width ? { width: column.width } : {}}
                onClick={() => handleHeaderClick(column)}
                role={column.sortable ? 'button' : undefined}
                tabIndex={column.sortable ? 0 : undefined}
                aria-sort={
                  column.sortable && sortColumn === column.key
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
              >
                <div className="flex items-center gap-base justify-between">
                  <span>{column.label}</span>
                  {column.sortable && sortColumn === column.key && (
                    <span className="flex-shrink-0">
                      {sortDirection === 'asc' ? (
                        <ChevronUp size={16} className="text-brand" />
                      ) : (
                        <ChevronDown size={16} className="text-brand" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {isLoading ? (
            // Loading skeleton rows
            Array.from({ length: loadingRows }).map((_, i) => (
              <tr
                key={`skeleton-${i}`}
                className={striped && i % 2 === 1 ? 'bg-neutral-50' : 'bg-white'}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-lg py-md">
                    <div className="h-4 bg-neutral-200 rounded animate-skeleton" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            // Empty state
            <tr>
              <td colSpan={columns.length} className="px-lg py-2xl text-center">
                <p className="text-neutral-600">No data available</p>
              </td>
            </tr>
          ) : (
            // Data rows
            data.map((row, i) => (
              <tr
                key={keyExtractor(row, i)}
                className={cn(
                  'border-t border-neutral-200',
                  striped && i % 2 === 1 && 'bg-neutral-50',
                  hoverable && 'hover:bg-brand-light transition-colors'
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'px-lg py-md text-body text-neutral-900',
                      getAlignClass(column.align)
                    )}
                  >
                    {column.render
                      ? column.render(row[column.key as keyof typeof row], row)
                      : String(row[column.key as keyof typeof row] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Table with Selection - Checkbox column for bulk operations
 */
export interface SelectableTableProps<T = any> extends TableProps<T> {
  selectedRows?: Set<string | number>;
  onSelectRow?: (key: string | number) => void;
  onSelectAll?: (selected: boolean) => void;
}

export function SelectableTable<T = any>({
  selectedRows = new Set(),
  onSelectRow,
  onSelectAll,
  columns,
  data,
  keyExtractor,
  ...props
}: SelectableTableProps<T>) {
  const allSelected = data.length > 0 && data.every((row, i) => selectedRows.has(keyExtractor(row, i)));

  const selectColumns: TableColumn<T>[] = [
    {
      key: '_select',
      label: '',
      width: '40px',
      render: (_, row) => {
        const key = keyExtractor(row, data.indexOf(row));
        return (
          <input
            type="checkbox"
            checked={selectedRows.has(key)}
            onChange={() => onSelectRow?.(key)}
            className="w-4 h-4 cursor-pointer"
            aria-label={`Select row ${key}`}
          />
        );
      },
    },
    ...columns,
  ];

  return (
    <Table
      {...props}
      columns={selectColumns}
      data={data}
      keyExtractor={keyExtractor}
      className="relative"
    >
      {/* Custom header with select-all checkbox */}
    </Table>
  );
}

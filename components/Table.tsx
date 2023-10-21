import React from 'react';
import Icon from '@/components/Icon';
import clsx from 'clsx';

type Props = {
  children: React.ReactNode;
  cols: {
    id: string;
    label: string;
    sortable?: boolean;
  }[];
  total: number;
  page?: number;
  perPage?: number;
  nextPage?: () => void;
  prevPage?: () => void;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (sortBy: string, sortDirection: 'asc' | 'desc') => void;
  isLoading?: boolean;
  error?: string;
};

export function Table({ children, total, isLoading, error, page, cols, sortBy, sortDirection, onSort, nextPage, prevPage, perPage = 20 }: Props) {
  const start = (page || 1) * perPage - perPage + 1;
  const end = Math.min(start + perPage - 1, total);
  const canNext = end < total;
  const canPrev = start > 1;

  const handleSort = (id: string) => {
    if (!onSort) return;
    if (sortBy === id) {
      onSort(id, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(id, 'asc');
    }
  };

  return (
    <div className='mt-4 flex flex-col'>
      <div className='overflow-auto rounded-lg border border-gray-200 align-middle'>
        <table className='w-full divide-y divide-gray-300 rounded-t-lg'>
          <thead>
            <tr>
              {cols.map(({ id, label, sortable }, index) => (
                <th
                  key={id}
                  scope='col'
                  className={clsx(
                    'bg-gray-50',
                    index === 0 && 'sm:rounded-tl-lg',
                    index === cols.length - 1 && 'sm:rounded-tr-lg',
                    sortable !== false && 'cursor-pointer',
                    index === 0 ? 'py-3.5 pl-3 pr-2 text-left text-[13px] font-semibold  sm:pl-5' : 'px-2 py-3.5 text-left text-[13px] font-semibold '
                  )}
                  onClick={sortable !== false ? () => onSort && handleSort(id) : undefined}
                >
                  <div className='flex items-center gap-2'>
                    {label}
                    {sortBy === id && sortDirection === 'asc' && <Icon name='sortUp' className='text-[14px] text-gray-700' />}
                    {sortBy === id && sortDirection === 'desc' && <Icon name='sortDown' className='text-[14px] text-gray-700' />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {isLoading && total === 0 && (
              <tr>
                <td colSpan={cols.length} className='p-4 text-center'>
                  <Icon name='spinner' className='animate-spin text-lg text-gray-500' />
                </td>
              </tr>
            )}
            {!isLoading && total === 0 && !error && (
              <tr>
                <td colSpan={cols.length} className='p-8 text-center'>
                  <p className='mb-1 text-md font-semibold '>No results found</p>
                  <p className='text-sm text-gray-600'>Your search and filters didn&apos;t return any results.</p>
                </td>
              </tr>
            )}
            {!isLoading && error && (
              <tr>
                <td colSpan={cols.length} className='p-8 text-center'>
                  <p className='mb-1 text-md font-semibold text-red-600'>An error occurred</p>
                  <p className='text-xs text-gray-500'>Error: {error}</p>
                </td>
              </tr>
            )}
            {children}
          </tbody>
        </table>

        <nav
          className='flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:rounded-b-lg sm:px-5'
          aria-label='Pagination'
        >
          <div className='hidden sm:block'>
            {total > 0 && (
              <p className='text-sm text-gray-700'>
                Showing <span className='font-medium'>{start}</span> to <span className='font-medium'>{end}</span> of{' '}
                <span className='font-medium'>{total?.toLocaleString() || 'many'}</span> results
              </p>
            )}
          </div>
          {prevPage && nextPage && (
            <div className='flex flex-1 justify-between sm:justify-end'>
              <Button onClick={prevPage} disabled={!canPrev}>
                Previous
              </Button>
              <Button onClick={nextPage} disabled={!canNext}>
                Next
              </Button>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}

type ButtonProps = {
  children: string;
  onClick: () => void;
  disabled?: boolean;
};

const Button = ({ onClick, disabled, children }: ButtonProps) => {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
        disabled ? 'opacity-50' : 'hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );
};

type CellProps = {
  children: any;
  className?: string;
  [key: string]: any;
};

export const Cell = ({ children, className, ...props }: CellProps) => (
  <td className={`cell ${className || ''}`} {...props}>
    {children}
  </td>
);

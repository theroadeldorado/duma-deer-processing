import React from 'react';
import clsx from 'clsx';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  /**
   * Whether to show the section divider (horizontal lines with title)
   * @default true
   */
  showDivider?: boolean;
}

/**
 * Reusable form section component for admin edit pages.
 * Renders a titled section with consistent styling and optional divider.
 */
export default function FormSection({ title, children, className, showDivider = true }: FormSectionProps) {
  return (
    <div className={clsx('flex flex-col', className)}>
      {showDivider && (
        <div className='mb-10 flex items-center justify-start gap-4'>
          <div className='mt-2 h-px w-full grow bg-gray-500'></div>
          <h3 className='shrink-0 text-center text-display-md font-bold'>{title}</h3>
          <div className='mt-2 h-px w-full grow bg-gray-500'></div>
        </div>
      )}
      {children}
    </div>
  );
}

interface FormSubSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  /**
   * Whether to show bottom border
   * @default true
   */
  showBorder?: boolean;
}

/**
 * Subsection within a form section, with optional title and border.
 */
export function FormSubSection({ title, children, className, showBorder = true }: FormSubSectionProps) {
  return (
    <div
      className={clsx(
        'mb-10 grid grid-cols-3 gap-4 pb-10',
        showBorder && 'border-b border-dashed border-gray-300',
        className
      )}
    >
      {title && <h3 className='col-span-3 shrink-0 text-display-xs font-bold'>{title}</h3>}
      {children}
    </div>
  );
}

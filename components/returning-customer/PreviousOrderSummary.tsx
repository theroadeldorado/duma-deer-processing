import React from 'react';
import Button from '@/components/Button';
import { DeerT, EditableSection } from '@/lib/types';
import { groupFormValuesBySections, SectionEntry } from '@/lib/formValueUtils';
import { calculateTotalPrice, getCapeHideTotalForDisplay } from '@/lib/priceCalculations';

interface PreviousOrderSummaryProps {
  formData: Partial<DeerT>;
  customerName: string;
  onSameAsLastTime: () => void;
  onStartFresh: () => void;
  onEditSection: (section: EditableSection) => void;
  isSubmitting?: boolean;
}

/**
 * Section display component with edit button
 */
function SummarySection({
  title,
  entries,
  editableSection,
  onEdit,
  emptyMessage,
}: {
  title: string;
  entries: SectionEntry[];
  editableSection: EditableSection;
  onEdit: (section: EditableSection) => void;
  emptyMessage?: string;
}) {
  // Filter out empty entries
  const displayEntries = entries.filter((entry) => {
    if (!entry.value || entry.value === '' || entry.value === 'false') return false;
    return true;
  });

  return (
    <div className='mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
      <div className='flex items-center justify-between'>
        <h4 className='text-lg font-semibold text-gray-900'>{title}</h4>
        <button
          type='button'
          onClick={() => onEdit(editableSection)}
          className='flex items-center gap-1 text-sm font-medium text-primary-blue hover:text-tan-2'
        >
          <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
            />
          </svg>
          Edit
        </button>
      </div>
      {displayEntries.length > 0 ? (
        <ul className='mt-3 space-y-2'>
          {displayEntries.map((entry) => (
            <li key={entry.key} className='flex items-start justify-between text-sm'>
              <span className='text-gray-600'>{entry.label}</span>
              <span className='ml-4 text-right font-medium text-gray-900'>
                {entry.value}
                {entry.price > 0 && (
                  <span className='ml-2 text-green-600'>
                    +${entry.price.toFixed(2)}
                    {entry.pricePer5lb && '/5lb'}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className='mt-2 text-sm italic text-gray-400'>{emptyMessage || 'None selected'}</p>
      )}
    </div>
  );
}

export default function PreviousOrderSummary({
  formData,
  customerName,
  onSameAsLastTime,
  onStartFresh,
  onEditSection,
  isSubmitting = false,
}: PreviousOrderSummaryProps) {
  // Remove historical pricing data to ensure current prices are used
  const dataForPricing = { ...formData };
  delete dataForPricing.historicalItemPrices;
  delete dataForPricing.pricingSnapshot;

  const { sectionedValues, hasEvenly } = groupFormValuesBySections(dataForPricing, {
    includeCapeHideProcessing: true,
  });

  const processingTotal = calculateTotalPrice(dataForPricing);
  const capeHideTotal = getCapeHideTotalForDisplay(dataForPricing);
  const grandTotal = processingTotal + capeHideTotal;

  // Extract and organize entries by section
  const cuttingInstructions = sectionedValues['Cutting Instructions'] || [];

  // Cape/Hide entries
  const capeHideEntries = cuttingInstructions.filter((entry) =>
    ['cape', 'hide', 'euroMount', 'shoulderMountHeadPosition', 'shoulderMountSpecialInstructions'].includes(entry.key)
  );

  // Processing type entry (skinned/boneless)
  const processingTypeEntries = cuttingInstructions.filter((entry) =>
    ['skinnedOrBoneless'].includes(entry.key)
  );

  // Cutting preferences (back straps, hind legs, roasts)
  const cuttingEntries = cuttingInstructions.filter((entry) =>
    ['backStrapsPreference', 'backStrap2Preference', 'hindLegPreference1', 'hindLegPreference2',
     'tenderizedCubedSteaks', 'roast'].includes(entry.key)
  );

  return (
    <div className='container mx-auto max-w-2xl px-4 py-8'>
      {/* Header */}
      <div className='mb-6 text-center'>
        <h1 className='mb-2 text-3xl font-bold text-gray-900'>Your Previous Order</h1>
        <p className='text-lg text-gray-600'>
          Hi {customerName}! Here&apos;s what you ordered last time with today&apos;s pricing.
        </p>
      </div>

      {/* Note about pricing */}
      <div className='mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4'>
        <div className='flex'>
          <svg className='h-5 w-5 flex-shrink-0 text-blue-400' viewBox='0 0 20 20' fill='currentColor'>
            <path
              fillRule='evenodd'
              d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
              clipRule='evenodd'
            />
          </svg>
          <p className='ml-3 text-sm text-blue-700'>
            Prices shown are today&apos;s current prices. Tap Edit on any section to make changes.
          </p>
        </div>
      </div>

      {/* Processing Type Section */}
      <SummarySection
        title='Processing Type'
        entries={processingTypeEntries}
        editableSection='processing-type'
        onEdit={onEditSection}
        emptyMessage='Standard processing'
      />

      {/* Cape/Hide Section */}
      <SummarySection
        title='Cape, Hide & Euro Mount'
        entries={capeHideEntries}
        editableSection='cape-hide'
        onEdit={onEditSection}
        emptyMessage='No mounting options selected'
      />

      {/* Cutting Preferences Section */}
      <SummarySection
        title='Cutting Preferences'
        entries={cuttingEntries}
        editableSection='cutting-preferences'
        onEdit={onEditSection}
        emptyMessage='Default cutting options'
      />

      {/* Ground Venison Section */}
      <SummarySection
        title='Ground Venison'
        entries={sectionedValues['Ground Venison'] || []}
        editableSection='ground-venison'
        onEdit={onEditSection}
        emptyMessage='Plain ground venison'
      />

      {/* Specialty Meats Section */}
      <SummarySection
        title='Specialty Meats'
        entries={sectionedValues['Specialty Meats'] || []}
        editableSection='specialty-meats'
        onEdit={onEditSection}
        emptyMessage='No specialty meats selected'
      />

      {/* Price Summary */}
      <div className='mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4'>
        <h4 className='mb-3 text-lg font-semibold text-gray-900'>Estimated Total</h4>
        <div className='space-y-2'>
          {capeHideTotal > 0 && (
            <div className='flex justify-between text-sm'>
              <span className='text-gray-600'>Taxidermy Total</span>
              <span className='font-medium'>${capeHideTotal.toFixed(2)}</span>
            </div>
          )}
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>
              {hasEvenly ? 'Standard Processing Price' : 'Processing Total'}
            </span>
            <span className='font-medium'>${processingTotal.toFixed(2)}</span>
          </div>
          {hasEvenly && (
            <div className='flex justify-between text-sm'>
              <span className='text-gray-600'>Specialty Meat Price</span>
              <span className='font-medium text-amber-600'>TBD (based on weight)</span>
            </div>
          )}
          <div className='mt-2 border-t border-gray-300 pt-2'>
            <div className='flex justify-between text-base font-bold'>
              <span>Estimated Grand Total</span>
              <span className='text-green-600'>${grandTotal.toFixed(2)}{hasEvenly && '+'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='space-y-3'>
        <Button
          onClick={onSameAsLastTime}
          disabled={isSubmitting}
          className='w-full py-4 text-lg'
          size='2xl'
        >
          {isSubmitting ? (
            <span className='flex items-center justify-center gap-2'>
              <svg className='h-5 w-5 animate-spin' viewBox='0 0 24 24'>
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                  fill='none'
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
              </svg>
              Submitting...
            </span>
          ) : (
            'Same as Last Time - Submit Order'
          )}
        </Button>

        <Button
          onClick={onStartFresh}
          disabled={isSubmitting}
          color='default'
          className='w-full py-3'
          size='xl'
        >
          Start Fresh - Customize Everything
        </Button>
      </div>
    </div>
  );
}

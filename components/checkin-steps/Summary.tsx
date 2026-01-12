import React from 'react';
import StepWrapper from './StepWrapper';
import { StepProps } from './types';
import { useFormContext } from 'react-hook-form';
import SummaryItem from '@/components/SummaryItem';
import SummaryItemsGeneral from '@/components/SummaryItemsGeneral';
import {
  calculateTotalPrice,
  getCapeHideTotalForDisplay,
} from '@/lib/priceCalculations';
import { groupFormValuesBySections } from '@/lib/formValueUtils';

export default function Summary(props: StepProps) {
  const form = useFormContext();
  const formValues = form.getValues();

  const { sectionedValues, hasEvenly } = groupFormValuesBySections(formValues, {
    includeCapeHideProcessing: true,
  });

  // Calculate cape/hide total for non-Take Today options
  const capeHideTotal = getCapeHideTotalForDisplay(formValues);
  const processingTotal = calculateTotalPrice(formValues);
  const hasCapeHideOptions = capeHideTotal > 0;

  return (
    <StepWrapper {...props} title='Summary & Checkout'>
      <div className='space-y-6'>
        <h3 className='mb-7 text-center text-display-sm font-bold'>Review Your Information</h3>

        {/* Render Contact Information first */}
        {sectionedValues['Contact Information'] && (
          <div key='Contact Information'>
            <div className='mb-6 gap-3 border-b border-dashed border-gray-900 pb-6'>
              <h4 className='my-4 text-xl font-bold'>Contact Information</h4>
              <SummaryItemsGeneral values={sectionedValues['Contact Information']} section='Contact Information' />
            </div>
          </div>
        )}

        {/* Render Cutting Instructions second */}
        {sectionedValues['Cutting Instructions'] && (
          <div key='Cutting Instructions'>
            {sectionedValues['Cutting Instructions'].some((value) => value.value !== '') && (
              <>
                {sectionedValues['Cutting Instructions'].length > 0 && (
                  <div className='mb-6 gap-3 border-b border-dashed border-gray-900 pb-6 last:border-0'>
                    <h4 className='my-4 text-xl font-bold'>Cutting Instructions:</h4>
                    <ul className='grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2'>
                      {sectionedValues['Cutting Instructions'].map(({ key, label, value, price, pricePer5lb, notes }) => (
                        <SummaryItem
                          key={key}
                          label={label}
                          value={value}
                          price={price}
                          pricePer5lb={pricePer5lb}
                          section='Cutting Instructions'
                          notes={notes}
                        />
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Render all other sections */}
        {Object.entries(sectionedValues)
          .filter(([section]) => section !== 'Contact Information' && section !== 'Cutting Instructions')
          .map(([section, values]) => (
            <div key={section}>
              {/* if section values have value !== '' */}
              {values.some((value) => value.value !== '') && (
                <>
                  {values.length > 0 && (
                    <div className='mb-6 gap-3 border-b border-dashed border-gray-900 pb-6 last:border-0'>
                      <h4 className='my-4 text-xl font-bold'>{section}:</h4>
                      <ul className='grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2'>
                        {values.map(({ key, label, value, price, pricePer5lb, notes }) => (
                          <SummaryItem
                            key={key}
                            label={label}
                            value={value}
                            price={price}
                            pricePer5lb={pricePer5lb}
                            section={section}
                            notes={notes}
                          />
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

        <div className='flex justify-end pb-10'>
          <div className='flex max-w-md flex-col gap-2'>
            {hasCapeHideOptions && (
              <div className='flex items-end justify-between gap-4 border-b border-gray-300 pb-1'>
                <h4 className='text-lg font-bold'>Taxidermy Total</h4>
                <p className='text-lg font-bold'>${capeHideTotal.toFixed(2)}</p>
              </div>
            )}

            {hasEvenly && (
              <div className='flex items-end justify-between gap-4 border-b border-gray-300 pb-1'>
                <div>
                  <h4 className='text-lg font-bold'>Specialty Meat Price</h4>
                  <p className='max-w-[600px] text-sm italic'>
                    Note: Selecting evenly distributed on a specialty meat could cause the price to increase by $300-$500
                  </p>
                </div>
                <p className='text-lg font-bold'>TBD</p>
              </div>
            )}

            <div className='flex items-end justify-between gap-4 border-b border-gray-300 pb-1'>
              <h4 className='text-lg font-bold'>{hasEvenly ? 'Standard Processing Price' : 'Processing Total'}</h4>
              <p className='text-lg font-bold'>${processingTotal.toFixed(2)}</p>
            </div>

            <div className='mt-1 flex items-end justify-between gap-4'>
              <h4 className='text-lg font-bold'>Grand Total</h4>
              <p className='text-lg font-bold'>${(processingTotal + capeHideTotal).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}

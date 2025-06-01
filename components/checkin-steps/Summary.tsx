import React from 'react';
import StepWrapper from './StepWrapper';
import { StepProps } from './types';
import { useFormContext } from 'react-hook-form';
import SummaryItem from '@/components/SummaryItem';
import SummaryItemsGeneral from '@/components/SummaryItemsGeneral';
import { productsConfig } from '@/lib/products';
import { calculateTotalPrice, calculatePriceForItem, findSpecialtyMeatConfig, getSpecialtyMeatPrice } from '@/lib/priceCalculations';

interface ProductOption {
  value?: string | number;
  label: string;
  price?: number;
  name?: string;
  pricePer5lb?: boolean;
  notes?: boolean;
}

interface Product {
  name?: string;
  section?: string;
  label: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  options?: ProductOption[];
  image?: string;
  price?: number;
  notes?: boolean;
}

interface SectionedValues {
  [section: string]: Array<{
    key: string;
    label: string;
    value: string | number;
    price: number;
    pricePer5lb?: boolean;
    notes?: boolean;
  }>;
}

function groupFormValuesBySections(formValues: Record<string, any>): { sectionedValues: SectionedValues; hasEvenly: boolean } {
  const sectionedValues: SectionedValues = {};
  let hasEvenly = false;

  Object.keys(formValues).forEach((key) => {
    // Skip quickOption from appearing in summary
    if (key === 'quickOption') {
      return;
    }

    const value = formValues[key];
    const config = productsConfig[key] as Product | undefined;

    if (config) {
      const section = config.section || 'Other';
      sectionedValues[section] = sectionedValues[section] || [];
      const price = calculatePriceForItem(key, value);
      const pricePer5lb = config.options?.find((option) => option.value === value)?.pricePer5lb || false;

      if (value === 'Evenly') {
        hasEvenly = true;
      }

      // Handle boolean values and special cases
      let displayValue = value;
      let actualPrice = price;

      // Special handling for tenderized cubed steaks
      if (key === 'tenderizedCubedSteaks' && value === 'true') {
        displayValue = 'Yes';
        actualPrice = 5; // Set the correct price for tenderized cubed steaks
      } else if (value === 'true') {
        displayValue = 'Yes';
      } else if (value === 'false') {
        return; // Skip false values
      }

      if (value && value !== 'false' && value !== '') {
        sectionedValues[section].push({
          key,
          label: config.label,
          value: displayValue,
          price: actualPrice,
          pricePer5lb,
          notes: config.notes,
        });
      }
    } else {
      const specialtyMeatConfig = findSpecialtyMeatConfig(key);
      if (specialtyMeatConfig) {
        const section = specialtyMeatConfig.section;
        sectionedValues[section] = sectionedValues[section] || [];
        const price = getSpecialtyMeatPrice(specialtyMeatConfig.name, key, value);
        const pricePer5lb = true;

        if (value === 'Evenly') {
          hasEvenly = true;
        }

        if (value && value !== 'false' && value !== '') {
          sectionedValues[section].push({ key, label: specialtyMeatConfig.label, value, price, pricePer5lb, notes: specialtyMeatConfig.notes });
        }
      }
    }
  });

  return { sectionedValues, hasEvenly };
}

export default function Summary(props: StepProps) {
  const form = useFormContext();
  const formValues = form.getValues();

  const { sectionedValues, hasEvenly } = groupFormValuesBySections(formValues);

  return (
    <StepWrapper {...props} title='Summary & Checkout'>
      <div className='space-y-6'>
        <h3 className='mb-7 text-center text-display-sm font-bold'>Review Your Information</h3>

        {Object.entries(sectionedValues).map(([section, values]) => (
          <div key={section}>
            {section === 'Contact Information' ? (
              <div className='mb-6 gap-3 border-b border-dashed border-gray-900 pb-6'>
                <h4 className='my-4 text-xl font-bold'>Contact Information</h4>
                <SummaryItemsGeneral values={values} section={section} />
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        ))}

        <div className='flex flex-col items-end text-right'>
          <h4 className='mt-4 text-lg font-bold'>{hasEvenly ? 'Standard Processing Price' : 'Total Price'}</h4>

          {hasEvenly && (
            <p className='max-w-[400px] text-sm italic'>
              Selecting evenly distributed on a specialty meat could cause the price to increase by $300-$500
            </p>
          )}
          <p className='mb-6 mt-1 text-display-sm font-bold'>
            <span className=''>$</span>
            {calculateTotalPrice(formValues).toFixed(2)}
          </p>
          {hasEvenly && (
            <>
              <h4 className='text-lg font-bold '>Specialty Meat Price</h4>
              <p className='mb-10 mt-1 text-display-sm font-bold'>
                <span className=''> TBD</span>
              </p>
            </>
          )}
        </div>
      </div>
    </StepWrapper>
  );
}

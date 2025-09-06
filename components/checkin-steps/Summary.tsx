import React from 'react';
import StepWrapper from './StepWrapper';
import { StepProps } from './types';
import { useFormContext } from 'react-hook-form';
import SummaryItem from '@/components/SummaryItem';
import SummaryItemsGeneral from '@/components/SummaryItemsGeneral';
import { productsConfig } from '@/lib/products';
import {
  calculateTotalPrice,
  calculatePriceForItem,
  findSpecialtyMeatConfig,
  getSpecialtyMeatPrice,
  calculateCapeHideTotal,
} from '@/lib/priceCalculations';

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
  const hindLegEntries = processHindLegs(formValues);

  Object.keys(formValues).forEach((key) => {
    // Skip quickOption from appearing in summary
    if (key === 'quickOption') {
      return;
    }
    if (key.startsWith('hindLeg') || key === 'tenderizedCubedSteaks') {
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

      if (value === 'true') {
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

  // Add processed hind leg entries
  if (hindLegEntries.length > 0) {
    const section = 'Cutting Instructions';
    sectionedValues[section] = sectionedValues[section] || [];
    sectionedValues[section].push(...hindLegEntries);
  }

  return { sectionedValues, hasEvenly };
}

function processHindLegs(formValues: Record<string, any>): Array<{
  key: string;
  label: string;
  value: string;
  price: number;
  pricePer5lb?: boolean;
  notes?: boolean;
}> {
  const entries = [];

  // Process Hind Leg 1
  const hindLeg1 = formValues.hindLegPreference1;
  if (hindLeg1 && hindLeg1 !== 'Grind') {
    let displayValue = hindLeg1;
    let price = 0;

    if (hindLeg1 === 'Whole Muscle Jerky') {
      const flavor = formValues.hindLegJerky1Flavor;
      if (flavor) {
        displayValue = `Whole Muscle Jerky - ${flavor}`;
      }
      price = 35;
    } else if (hindLeg1 === 'Steaks') {
      const tenderized = formValues.tenderizedCubedSteaks;
      if (tenderized === 'true') {
        displayValue = 'Steaks - Tenderized Cubed';
        price = 5;
      }
    }

    entries.push({
      key: 'hindLegPreference1',
      label: 'Hind Leg 1 Preference',
      value: displayValue,
      price: price,
    });
  }

  // Process Hind Leg 2
  const hindLeg2 = formValues.hindLegPreference2;
  if (hindLeg2 && hindLeg2 !== 'Grind') {
    let displayValue = hindLeg2;
    let price = 0;

    if (hindLeg2 === 'Whole Muscle Jerky') {
      const flavor = formValues.hindLegJerky2Flavor;
      if (flavor) {
        displayValue = `Whole Muscle Jerky - ${flavor}`;
      }
      price = 35;
    } else if (hindLeg2 === 'Steaks') {
      // Only show tenderized price if leg 1 is not steaks (to avoid double charging)
      const tenderized = formValues.tenderizedCubedSteaks;
      const leg1IsAlsoSteaks = formValues.hindLegPreference1 === 'Steaks';
      if (tenderized === 'true') {
        displayValue = 'Steaks - Tenderized Cubed';
        price = leg1IsAlsoSteaks ? 0 : 5; // Only charge once for tenderized
      }
    }

    entries.push({
      key: 'hindLegPreference2',
      label: 'Hind Leg 2 Preference',
      value: displayValue,
      price: price,
    });
  }

  return entries;
}

export default function Summary(props: StepProps) {
  const form = useFormContext();
  const formValues = form.getValues();

  const { sectionedValues, hasEvenly } = groupFormValuesBySections(formValues);

  // Calculate cape/hide total for non-Take Today options
  const capeHideTotal = calculateCapeHideTotal(formValues);
  const processingTotal = calculateTotalPrice(formValues);
  const hasCapeHideOptions = capeHideTotal > 0;

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

        <div className='flex justify-end pb-10'>
          <div className='flex max-w-md flex-col gap-2'>
            {hasCapeHideOptions && (
              <div className='flex items-end justify-between gap-4 border-b border-gray-300 pb-1'>
                <h4 className='text-lg font-bold'>Hide/Mount Total</h4>
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

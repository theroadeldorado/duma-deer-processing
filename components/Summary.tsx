import React from 'react';
import { productsConfig } from 'lib/products';
import {
  calculateTotalPrice,
  calculatePriceForItem,
  findSpecialtyMeatConfig,
  getSpecialtyMeatPrice,
  calculateCapeHideTotal,
} from 'lib/priceCalculations';
import SummaryItem from './SummaryItem';
import SummaryItemsGeneral from './SummaryItemsGeneral';
import { DeerT } from '@/lib/types';

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

interface SpecialtyMeat {
  name: string;
  image: string;
  options: ProductOption[];
}

interface SpecialtyMeatsConfig {
  section: string;
  meats: SpecialtyMeat[];
}

interface ProductsConfig {
  name: Product;
  fullAddress: Product;
  phone: Product;
  communication: Product;
  tagNumber: Product;
  stateHarvestedIn: Product;
  skinnedOrBoneless: Product;
  cape: Product;
  hide: Product;
  euroMount: Product;
  backStrapsPreference: Product;
  hindLegPreference1: Product;
  hindLegPreference2: Product;
  hindLegJerky1: Product;
  hindLegJerky2: Product;
  tenderizedCubedSteaks: Product;
  roast: Product;
  groundVenison: Product;
  // ... other specific product properties

  specialtyMeats: SpecialtyMeatsConfig;
}

interface SummaryProps {
  formValues: DeerT;
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

const Summary: React.FC<SummaryProps> = ({ formValues }) => {
  const { sectionedValues, hasEvenly } = groupFormValuesBySections(formValues);

  // Calculate cape/hide total for non-Take Today options
  const capeHideTotal = calculateCapeHideTotal(formValues);
  const processingTotal = calculateTotalPrice(formValues);
  const hasCapeHideOptions = capeHideTotal > 0;

  return (
    <div>
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
                      <ul className='grid grid-cols-2 gap-x-10 gap-y-5'>
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
      <div className='flex justify-end'>
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
  );
};

function groupFormValuesBySections(formValues: Record<string, any>): { sectionedValues: SectionedValues; hasEvenly: boolean } {
  const sectionedValues: SectionedValues = {};
  let hasEvenly = false;

  Object.keys(formValues).forEach((key) => {
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

      if (value) {
        sectionedValues[section].push({ key, label: config.label, value, price, pricePer5lb, notes: config.notes });
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

        if (value) {
          sectionedValues[section].push({ key, label: specialtyMeatConfig.label, value, price, pricePer5lb, notes: specialtyMeatConfig.notes });
        }
      }
    }
  });

  return { sectionedValues, hasEvenly };
}

export default Summary;

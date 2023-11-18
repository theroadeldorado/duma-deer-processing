import React from 'react';
import { productsConfig } from 'lib/products';
import { calculateTotalPrice, calculatePriceForItem, findSpecialtyMeatConfig, getSpecialtyMeatPrice } from 'lib/priceCalculations';
import SummaryItem from './SummaryItem';
import SummaryItemsGeneral from './SummaryItemsGeneral';
import { DeerT } from '@/lib/types';

interface ProductOption {
  value?: string | number;
  label: string;
  price?: number;
  name?: string;
  pricePer5lb?: boolean;
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
  }>;
}

const Summary: React.FC<SummaryProps> = ({ formValues }) => {
  const sectionedFormValues = groupFormValuesBySections(formValues);
  return (
    <div>
      <h3 className='mb-7 text-center text-display-sm font-bold'>Review Your Information</h3>
      {Object.entries(sectionedFormValues).map(([section, values]) => (
        <div key={section}>
          {/* if has values */}
          {section === 'Contact Information' ? (
            <div className='mb-6 gap-3 border-b border-dashed border-gray-300 pb-6'>
              <h4 className='my-4 text-xl font-bold'>Contact Information</h4>
              <SummaryItemsGeneral values={values} section={section} />
            </div>
          ) : (
            <>
              {values.length > 0 && (
                <div className='mb-6 gap-3 border-b border-dashed border-gray-300 pb-6 last:border-0'>
                  <h4 className='my-4 text-xl font-bold'>{section}:</h4>
                  <ul className='grid grid-cols-2 gap-x-10 gap-y-5'>
                    {values.map(({ key, label, value, price, pricePer5lb }) => (
                      <SummaryItem key={key} label={label} value={value} price={price} pricePer5lb={pricePer5lb} section={section} />
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      ))}
      <div className='text-right'>
        <h4 className='mt-4 text-lg font-bold'>Estimated Total Price</h4>
        <p className='text-sm italic'>Your price will vary based on the yield</p>
        <p className='mb-10 mt-1 text-display-sm  font-bold'>
          <span className=''>$</span>
          {calculateTotalPrice(formValues).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

function groupFormValuesBySections(formValues: Record<string, any>): SectionedValues {
  const sectionedValues: SectionedValues = {};

  Object.keys(formValues).forEach((key) => {
    const value = formValues[key];
    const config = productsConfig[key] as Product | undefined;

    if (config) {
      const section = config.section || 'Other';
      sectionedValues[section] = sectionedValues[section] || [];
      const price = calculatePriceForItem(key, value);
      // set pricePer5lb to true if the option has a price and pricePer5lb is true if its undefined set to false
      const pricePer5lb = config.options?.find((option) => option.value === value)?.pricePer5lb || false;

      sectionedValues[section].push({ key, label: config.label, value, price, pricePer5lb });
    } else {
      // Handle specialty meats
      const specialtyMeatConfig = findSpecialtyMeatConfig(key);
      if (specialtyMeatConfig) {
        const section = specialtyMeatConfig.section;
        sectionedValues[section] = sectionedValues[section] || [];
        const price = getSpecialtyMeatPrice(specialtyMeatConfig.name, key, value);
        const pricePer5lb = true;
        sectionedValues[section].push({ key, label: specialtyMeatConfig.label, value, price, pricePer5lb });
      }
    }
  });

  return sectionedValues;
}

export default Summary;

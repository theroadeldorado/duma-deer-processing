import React from 'react';
import { DeerT } from 'lib/types';
import Summary from './Summary';
import { productsConfig } from 'lib/products';
import { calculateTotalPrice, calculatePriceForItem, findSpecialtyMeatConfig, getSpecialtyMeatPrice } from 'lib/priceCalculations';
import SummaryItemsGeneral from './SummaryItemsGeneral';
import SummaryItem from './SummaryItem';
import Logo from './Logo';
import clsx from 'clsx';

interface PrintDeerDetailsProps {
  data: DeerT;
}

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

const PrintDeerDetails: React.FC<PrintDeerDetailsProps> = ({ data }) => {
  const renderWithLineBreaks = (text: string) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  const renderContactInformation = () => {
    const contactInfo = sectionedValues['Contact Information'] || [];
    return contactInfo.map(({ label, value }, index) => (
      <div key={index} className='flex flex-col '>
        <div className='font-bold'>{label}:</div>
        <div className='text-md'>{value}</div>
      </div>
    ));
  };

  const renderOtherInformation = (name: keyof SectionedValues) => {
    const contactInfo = sectionedValues[name] || [];

    return contactInfo.map(({ key, label, value, price, pricePer5lb, notes }, index) => (
      <SummaryItem key={key} label={label} value={value} price={price} pricePer5lb={pricePer5lb} notes={notes} />
    ));
  };

  const checkForPrice = (price: any) => {
    return price ? price : 0;
  };

  const { sectionedValues, hasEvenly } = groupFormValuesBySections(data);

  return (
    <div className='print-container aspect-[11/8.5] w-[1400px] p-8'>
      <div className='grid grid-cols-2 gap-x-12'>
        <div>
          <div className={clsx((data.cape || data.euroMount || data.hide) && 'border-[6px] border-red-500 p-2')}>
            <h4 className='mb-4 text-xl font-bold'>Contact Information</h4>
            <div className='grid grid-cols-3 gap-x-8 gap-y-1'>{renderContactInformation()}</div>
            <div className='gap-3 '>
              <h4 className='my-4 text-xl font-bold'>Cutting Instructions</h4>
              <div className='grid grid-cols-1 gap-x-8 gap-y-3'>{renderOtherInformation('Cutting Instructions')}</div>
            </div>
            <div className='mb-6 gap-3 border-b border-dashed border-gray-900 pb-6 last:border-0'>
              <h4 className='my-4 text-xl font-bold'>Notes:</h4>
              <div className='grid grid-cols-2 gap-x-8 gap-y-3'>{renderOtherInformation('Cutting Instructions Notes')}</div>
            </div>
          </div>
        </div>
        <div>
          <div className='mb-6 gap-3'>
            <h4 className='my-4 text-xl font-bold'>Ground Venison</h4>
            <div className='grid gap-x-8 gap-y-3'>{renderOtherInformation('Ground Venison')}</div>
          </div>
          <div className='mb-6 gap-3 pb-6 last:border-0'>
            <h4 className='my-4 text-xl font-bold'>Specialty Meats</h4>
            <div className='grid grid-cols-2 gap-x-8 gap-y-3'>{renderOtherInformation('Specialty Meats')}</div>
          </div>
          <div className='mb-6 gap-3 border-b border-dashed border-gray-900 pb-6 last:border-0'>
            <h4 className='my-4 text-xl font-bold'>Notes:</h4>
            <div className='grid grid-cols-2 gap-x-8 gap-y-3'>{renderOtherInformation('Specialty Meats Notes')}</div>
          </div>
          <div className='flex flex-col items-end text-right'>
            <h4 className='mt-4 text-lg font-bold'>{hasEvenly ? 'Standard Processing Price' : 'Total Price'}</h4>

            {hasEvenly && (
              <p className='max-w-[400px] text-sm italic'>
                Selecting evenly distributed on a specialty meat could cause the price to increase by $300-$500
              </p>
            )}
            <p className='mb-6 mt-1 text-display-sm font-bold'>
              <span className=''>$</span>
              {calculateTotalPrice(data).toFixed(2)}
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
      </div>
    </div>
  );
};

export default PrintDeerDetails;

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
        console.log(section, value);
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

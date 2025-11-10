import React from 'react';
import { DeerT } from 'lib/types';
import Summary from './Summary';
import { productsConfig } from 'lib/products';
import {
  calculateTotalPrice,
  calculatePriceForItem,
  findSpecialtyMeatConfig,
  getSpecialtyMeatPrice,
  getItemPriceForDisplay,
} from 'lib/priceCalculations';
import SummaryItemsGeneral from './SummaryItemsGeneral';
import SummaryItem from './SummaryItem';
import Logo from './Logo';
import clsx from 'clsx';
import dayjs from 'dayjs';

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
  const { sectionedValues, hasEvenly } = groupFormValuesBySections(data);

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
    return <SummaryItemsGeneral values={contactInfo} print />;
    return contactInfo.map(({ label, value }, index) => (
      <div key={index} className='flex flex-col'>
        {/* <div className='font-bold'>{label}:</div> */}
        <div className={clsx((label == 'Name' || label == 'Phone') && 'text-xl font-bold', 'text-md')}>{value}</div>
      </div>
    ));
  };

  const renderOtherInformation = (name: keyof SectionedValues) => {
    const contactInfo = sectionedValues[name] || [];

    return contactInfo.map(({ key, label, value, price, pricePer5lb, notes }, index) => (
      <SummaryItem key={key} label={label} value={value} price={price} pricePer5lb={pricePer5lb} notes={notes} print />
    ));
  };

  const checkForPrice = (price: any) => {
    return price ? price : 0;
  };

  return (
    <div className='print-container flex flex-col'>
      <div className='break-after-page bg-white'>
        <div className='aspect-[5/8] w-[720px] break-inside-avoid-page bg-white'>
          <div
            className={clsx(
              (data.cape && data.cape !== 'false') || (data.euroMount && data.euroMount !== 'false') || (data.hide && data.hide !== 'false')
                ? 'border-red-500'
                : 'border-white',
              'border-[6px] p-2'
            )}
          >
            <div className='grid grid-cols-3 gap-8'>
              <h4 className='mb-2 font-bold'>{data.createdAt && dayjs(data.createdAt).format('M/D/YY  h:mm A')}</h4>
              <h4 className='mb-2'>
                Shot:{' '}
                {data.dateHarvested ? (dayjs(data.dateHarvested).isValid() ? dayjs(data.dateHarvested).format('M/D/YY') : data.dateHarvested) : '—'}
              </h4>
              <h4 className='mb-2'>
                Found: {data.dateFound ? (dayjs(data.dateFound).isValid() ? dayjs(data.dateFound).format('M/D/YY') : data.dateFound) : '—'}
              </h4>
            </div>
            <div className='border-b border-dashed border-gray-900 pb-3'>{renderContactInformation()}</div>
            <div className='gap-3 '>
              <h4 className='my-4 text-xl font-bold'>Cutting Instructions</h4>
              <div className='grid grid-cols-1 gap-x-8 gap-y-3'>{renderOtherInformation('Cutting Instructions')}</div>
            </div>
            {sectionedValues['Cutting Instructions Notes'] && (
              <div className='mb-4 gap-3 border-b border-dashed border-gray-900 pb-6 last:border-0'>
                <h4 className='mb-4 mt-2 text-xl font-bold'>Notes:</h4>
                <div className='grid grid-cols-1 gap-x-8 gap-y-3'>{renderOtherInformation('Cutting Instructions Notes')}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='break-after-page bg-white'>
        <div className='relative z-[1] aspect-[5/8] w-[720px] break-inside-avoid-page bg-white'>
          <div
            className={clsx(
              (data.cape && data.cape !== 'false') || (data.euroMount && data.euroMount !== 'false') || (data.hide && data.hide !== 'false')
                ? 'border-red-500'
                : 'border-white',
              'flex flex-col justify-between border-[6px] p-2'
            )}
          >
            <div>
              <h4 className='mb-2 font-bold'></h4>
              <div className='mb-6 gap-3'>
                <h4 className='my-4 text-xl font-bold'>Ground Venison</h4>
                <div className='grid gap-x-8 gap-y-3'>{renderOtherInformation('Ground Venison')}</div>
              </div>
              <div className='mb-6 gap-3 pb-6 last:border-0'>
                <h4 className='my-4 text-xl font-bold'>Specialty Meats</h4>
                <div className='grid grid-cols-1 gap-x-8 gap-y-3'>{renderOtherInformation('Specialty Meats')}</div>
              </div>

              {sectionedValues['Specialty Meats Notes'] && (
                <div className='mb-4 gap-3 border-b border-dashed border-gray-900 pb-6 last:border-0'>
                  <h4 className='mb-4 mt-2 text-xl font-bold'>Notes:</h4>
                  <div className='grid grid-cols-1 gap-x-8 gap-y-3'>{renderOtherInformation('Specialty Meats Notes')}</div>
                </div>
              )}
              <div className='flex flex-col items-end text-right'>
                <h4 className='mt-4 text-lg font-bold'>{hasEvenly ? 'Standard Processing Price' : 'Total Price'}</h4>

                {hasEvenly && (
                  <p className='max-w-[400px] text-sm italic'>
                    Selecting evenly distributed on a specialty meat could cause the price to increase by $300-$500+
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
            <div className='flex items-start gap-10'>
              <div className='flex-1'>
                <div className='my-4 flex items-end gap-1'>
                  <h4 className='shrink-0 grow text-xl font-bold'>$60 Deposit:</h4>
                  <span className='block w-full grow border-b border-dashed border-gray-900'></span>
                </div>
                <div className='flex items-start gap-6 text-[14px]'>
                  <span>Cash</span>
                  <span>Check</span>
                  <span>CC</span>
                </div>
              </div>
              <div className='flex-1'>
                <div className='my-4 flex items-end gap-1'>
                  <h4 className='shrink-0 grow text-xl font-bold'>Balance Due:</h4>
                  <span className='block w-full grow border-b border-dashed border-gray-900'></span>
                </div>
                <div className='flex items-start gap-6  text-[14px]'>
                  <span>Cash</span>
                  <span>Check</span>
                  <span>
                    <strong>CC $2</strong> Initials:
                  </span>
                </div>
              </div>
            </div>
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
  const hindLegEntries = processHindLegs(formValues);

  Object.keys(formValues).forEach((key) => {
    // Skip all hind leg related fields - they're handled by processHindLegs()
    if (key.startsWith('hindLeg') || key === 'tenderizedCubedSteaks' || key === 'hindLegJerky1Flavor' || key === 'hindLegJerky2Flavor') {
      return;
    }

    const value = formValues[key];
    const config = productsConfig[key] as Product | undefined;

    if (config) {
      const section = config.section || 'Other';
      sectionedValues[section] = sectionedValues[section] || [];
      const price = getItemPriceForDisplay(key, value, formValues);
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

      if (key === 'groundVenison' && formValues.skinnedOrBoneless === 'Boneless') {
        if (value === 'Add Pork Trim' || value === 'Add Beef Trim') {
          actualPrice = 5;
        } else if (value === 'Add Beef & Pork Trim') {
          actualPrice = 10;
        }
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
        const price =
          formValues.historicalItemPrices && formValues.historicalItemPrices[key] !== undefined
            ? formValues.historicalItemPrices[key]
            : getSpecialtyMeatPrice(specialtyMeatConfig.name, key, value);
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

  // reorder sections so name, phone are first two in their group
  const contactInfo = sectionedValues['Contact Information'];
  if (contactInfo) {
    const nameIndex = contactInfo.findIndex((item) => item.key === 'name');
    const phoneIndex = contactInfo.findIndex((item) => item.key === 'phone');
    if (nameIndex > -1) {
      const name = contactInfo.splice(nameIndex, 1)[0];
      contactInfo.unshift(name);
    }
    if (phoneIndex > -1) {
      const phone = contactInfo.splice(phoneIndex, 1)[0];
      contactInfo.splice(1, 0, phone);
    }
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
  if (hindLeg1) {
    let displayValue = hindLeg1;
    let price = 0;

    if (hindLeg1 === 'Whole Muscle Jerky') {
      const flavor = formValues.hindLegJerky1Flavor;
      if (flavor) {
        displayValue = `Whole Muscle Jerky - ${flavor}`;
      }
      // Use historical pricing if available, otherwise default to 35
      price = getItemPriceForDisplay('hindLegPreference1', hindLeg1, formValues) || 35;
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
  if (hindLeg2) {
    let displayValue = hindLeg2;
    let price = 0;

    if (hindLeg2 === 'Whole Muscle Jerky') {
      const flavor = formValues.hindLegJerky2Flavor;
      if (flavor) {
        displayValue = `Whole Muscle Jerky - ${flavor}`;
      }
      // Use historical pricing if available, otherwise default to 35
      price = getItemPriceForDisplay('hindLegPreference2', hindLeg2, formValues) || 35;
    } else if (hindLeg2 === 'Steaks') {
      const tenderized = formValues.tenderizedCubedSteaks;
      const leg1IsAlsoSteaks = formValues.hindLegPreference1 === 'Steaks';
      if (tenderized === 'true') {
        displayValue = 'Steaks - Tenderized Cubed';
        price = leg1IsAlsoSteaks ? 0 : 5;
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

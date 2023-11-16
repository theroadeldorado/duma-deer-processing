import React from 'react';
import { productsConfig } from '../lib/products';
import SummaryItem from './SummaryItem';

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
  priceCondition?: (value: any) => number;
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
  communicationPreference: Product;
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
  formValues: Record<string, any>;
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
      <h3 className='mb-4 text-lg font-bold'>Review Your Information:</h3>
      {Object.entries(sectionedFormValues).map(([section, values]) => (
        <div key={section}>
          <h4 className='mt-4 mb-2 font-bold text-display-md'>{section}:</h4>
          <ul className='mb-4'>
            {values.map(({ key, label, value, price, pricePer5lb }) => (
              <SummaryItem key={key} label={label} value={value} price={price} pricePer5lb={pricePer5lb} />
            ))}
          </ul>
        </div>
      ))}
      <h4 className='mt-4 mb-2 text-lg font-bold'>Total Price:</h4>
      <p className='mt-4'>
        <span className='font-bold'>$</span>
        {calculateTotalPrice(formValues).toFixed(2)}
      </p>
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
      const price = calculatePriceForItem(key, value, productsConfig);
      sectionedValues[section].push({ key, label: config.label, value, price });
    } else {
      // Handle specialty meats
      const specialtyMeatConfig = findSpecialtyMeatConfig(key);
      if (specialtyMeatConfig) {
        const section = specialtyMeatConfig.section;
        sectionedValues[section] = sectionedValues[section] || [];
        const price = getSpecialtyMeatPrice(specialtyMeatConfig.name, key);
        sectionedValues[section].push({ key, label: specialtyMeatConfig.label, value, price });
      }
    }
  });

  return sectionedValues;
}

function findSpecialtyMeatConfig(optionName: string): { section: string; label: string; name: string } | undefined {
  const specialtyMeatsConfig = productsConfig.specialtyMeats as SpecialtyMeatsConfig;
  for (const meat of specialtyMeatsConfig.meats) {
    const option = meat.options.find((option) => option.name === optionName);
    if (option) {
      return { section: specialtyMeatsConfig.section, label: option.label, name: meat.name };
    }
  }
  return undefined;
}

function getSpecialtyMeatPrice(meatName: string, optionName: string): number {
  const specialtyMeatsConfig = productsConfig.specialtyMeats as SpecialtyMeatsConfig;
  const meat = specialtyMeatsConfig.meats.find((meat) => meat.name === meatName);
  if (meat) {
    const option = meat.options.find((option) => option.name === optionName);
    if (option) {
      return calculateOptionPrice(option);
    }
  }
  return 0;
}

function calculateTotalPrice(formValues: Record<string, any>): number {
  return Object.keys(formValues).reduce((total, key) => {
    const config = productsConfig[key] as Product | undefined;
    let price = 0;

    if (config) {
      price = calculatePriceForItem(key, formValues[key], productsConfig);
    } else {
      const specialtyMeatConfig = findSpecialtyMeatConfig(key);
      if (specialtyMeatConfig) {
        price = getSpecialtyMeatPrice(specialtyMeatConfig.name, key);
      }
    }

    return total + price;
  }, 0);
}

function isProductConfigKey(key: string): key is keyof ProductsConfig {
  return key in productsConfig;
}

function calculatePriceForItem(key: string, value: any, productsConfig: Partial<ProductsConfig>): number {
  if (!isProductConfigKey(key)) {
    return 0;
  }

  const config = productsConfig[key] as Product | undefined;
  if (!config) return 0;
  if (config.options) {
    let totalPrice = 0;
    if (Array.isArray(value)) {
      value.forEach((val) => {
        const option = findOptionInConfig(config, val);
        if (option) {
          totalPrice += calculateOptionPrice(option);
        }
      });
    } else {
      const option = findOptionInConfig(config, value);
      if (option) {
        totalPrice = calculateOptionPrice(option);
      }
    }

    return totalPrice;
  }

  return config.price || 0;
}

function findOptionInConfig(config: Product, value: string): ProductOption | undefined {
  return config.options?.find((option) => option.value === value || option.name === value);
}

function calculateOptionPrice(option: ProductOption): number {
  if (option.pricePer5lb) {
    return option.price ? option.price * 5 : 0;
  }
  return option.price || 0;
}

export default Summary;

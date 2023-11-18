import { DeerT, DeerInputT } from './types';
import { productsConfig, ProductsConfig } from './products';

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

export function findSpecialtyMeatConfig(optionName: string): { section: string; label: string; name: string } | undefined {
  const specialtyMeatsConfig = productsConfig.specialtyMeats as SpecialtyMeatsConfig;
  for (const meat of specialtyMeatsConfig.meats) {
    const option = meat.options.find((option) => option.name === optionName);
    if (option) {
      return { section: specialtyMeatsConfig.section, label: option.label, name: meat.name };
    }
  }
  return undefined;
}

export function calculateTotalPrice(formValues: DeerInputT): number {
  let total = 0;
  for (const key in formValues) {
    if (key in productsConfig) {
      const config = productsConfig[key as keyof ProductsConfig];

      if (config) {
        const price = calculatePriceForItem(key, formValues[key]);
        console.log(key, price);
        total += price;
      }
    } else {
      const specialtyMeatConfig = findSpecialtyMeatConfig(key);
      if (specialtyMeatConfig) {
        const price = getSpecialtyMeatPrice(specialtyMeatConfig.name, key, formValues[key]);
        total += price;
      }
    }
  }

  return total;
}

type StringKeyOf<T> = Extract<keyof T, string>;

function isProductConfigKey(key: string): key is StringKeyOf<ProductsConfig> {
  return key in productsConfig;
}

export function calculatePriceForItem(key: string, value: any): number {
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
          totalPrice += calculateOptionPrice(option, val);
        }
      });
    } else {
      const option = findOptionInConfig(config, value);
      if (option) {
        totalPrice = calculateOptionPrice(option, value);
      }
    }

    return totalPrice;
  }

  return config.price || 0;
}

export function getSpecialtyMeatPrice(meatName: string, optionName: string, value: number | string): number {
  if (value === undefined) return 0;
  const specialtyMeatsConfig = productsConfig.specialtyMeats as SpecialtyMeatsConfig;
  const meat = specialtyMeatsConfig.meats.find((meat) => meat.name === meatName);
  if (meat) {
    const option = meat.options.find((option) => option.name === optionName);
    if (option) {
      return calculateOptionPrice(option, value);
    }
  }
  return 0;
}

function findOptionInConfig(config: Product, value: string): ProductOption | undefined {
  return config.options?.find((option) => option.value === value || option.name === value);
}

function calculateOptionPrice(option: ProductOption, value: number | string): number {
  if (option.price && option.pricePer5lb) {
    if (typeof value === 'string') {
      if (value === 'Evenly') {
        return option.price || 0;
      } else {
        return option.price ? option.price * (parseInt(value) / 5) : 0;
      }
    }
  }
  return option.price || 0;
}

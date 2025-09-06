import { DeerT, DeerInputT } from './types';
import { productsConfig, ProductsConfig } from './products';

interface ProductOption {
  value?: string | number;
  label: string;
  price?: number;
  name?: string;
  pricePer5lb?: boolean;
  isTakeToday?: boolean;
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

export function findSpecialtyMeatConfig(optionName: string): { section: string; label: string; name: string; notes?: boolean } | undefined {
  const specialtyMeatsConfig = productsConfig.specialtyMeats as SpecialtyMeatsConfig;
  for (const meat of specialtyMeatsConfig.meats) {
    const option = meat.options.find((option) => option.name === optionName);
    if (option) {
      return { section: specialtyMeatsConfig.section, label: option.label, name: meat.name };
    }
  }
  return undefined;
}

export function calculateCapeHideTotal(formValues: DeerInputT): number {
  let total = 0;

  // Check cape option
  if (formValues.cape && formValues.cape !== '') {
    const capeConfig = productsConfig.cape as Product;
    const capeOption = capeConfig.options?.find((option) => option.value === formValues.cape) as ProductOption;
    if (capeOption && !capeOption.isTakeToday) {
      total += capeOption.price || 0;
    }
  }

  // Check hide option
  if (formValues.hide && formValues.hide !== '') {
    const hideConfig = productsConfig.hide as Product;
    const hideOption = hideConfig.options?.find((option) => option.value === formValues.hide) as ProductOption;
    if (hideOption && !hideOption.isTakeToday) {
      total += hideOption.price || 0;
    }
  }

  // Check euroMount option
  if (formValues.euroMount && formValues.euroMount !== '' && formValues.euroMount !== 'none') {
    const euroConfig = productsConfig.euroMount as Product;
    const euroOption = euroConfig.options?.find((option) => option.value === formValues.euroMount) as ProductOption;
    if (euroOption && !euroOption.isTakeToday) {
      total += euroOption.price || 0;
    }
  }

  return total;
}

export function calculateTotalPrice(formValues: DeerInputT): number {
  // If this is a donation, return $0
  if (formValues.skinnedOrBoneless === 'Donation') {
    return 0;
  }

  let total = 0;
  for (const key in formValues) {
    if (key in productsConfig) {
      const config = productsConfig[key as keyof ProductsConfig];

      if (config) {
        // Skip cape/hide/euroMount options that are not "Take Today" as they'll be calculated separately
        if ((key === 'cape' || key === 'hide' || key === 'euroMount') && formValues[key] !== '') {
          const options = (config as Product).options;
          const selectedOption = options?.find((option) => option.value === formValues[key]) as ProductOption;
          if (selectedOption && selectedOption.isTakeToday) {
            total += selectedOption.price || 0;
          }
          // Skip non-take-today options as they'll be in capeHideTotal
          continue;
        }

        const price = calculatePriceForItem(key, formValues[key]);
        total += price;
      }
    } else {
      const specialtyMeatConfig = findSpecialtyMeatConfig(key);
      if (specialtyMeatConfig) {
        const price = getSpecialtyMeatPrice(specialtyMeatConfig.name, key, formValues[key]);
        if (formValues[key] !== 'Evenly') {
          total += price;
        }
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
  if (!isProductConfigKey(key) || value === undefined || value === 'false') {
    return 0;
  }

  const config = productsConfig[key] as Product | undefined;
  if (!config) return 0;

  if (key.includes('JerkyFlavor') || (key.includes('Jerky') && key.includes('Flavor'))) {
    return 0;
  }

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
  if (value === undefined || value === 'false') return 0;
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

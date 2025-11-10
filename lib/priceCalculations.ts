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

/**
 * Gets the cape/hide total for display purposes, prioritizing stored historical value
 * over calculated value to preserve pricing history.
 */
export function getCapeHideTotalForDisplay(formValues: DeerInputT | DeerT): number {
  // If we have a stored capeHideTotal (historical pricing), use it
  if (formValues.capeHideTotal !== undefined && formValues.capeHideTotal !== null) {
    return formValues.capeHideTotal;
  }

  // For entries with no stored pricing, fall back to current pricing
  // (This should only happen for very old entries that haven't been migrated)

  // Otherwise, calculate using current pricing (for new entries or legacy data)
  return calculateCapeHideTotal(formValues);
}

/**
 * Gets the price for an individual item, prioritizing historical pricing over current config
 */
export function getItemPriceForDisplay(key: string, value: any, formValues: DeerInputT | DeerT): number {
  // First priority: stored historical pricing for this specific item
  if (formValues.historicalItemPrices && formValues.historicalItemPrices[key] !== undefined) {
    return formValues.historicalItemPrices[key];
  }

  // Second priority: pricing snapshot lookup
  if (formValues.pricingSnapshot) {
    const snapshotPrice = getPriceFromSnapshot(key, value, formValues.pricingSnapshot);
    if (snapshotPrice !== null) {
      return snapshotPrice;
    }
  }

  // Third priority: for legacy entries with cape/hide data but no historical item prices,
  // try to derive individual prices from stored capeHideTotal
  if (formValues.capeHideTotal !== undefined && formValues.capeHideTotal !== null) {
    const legacyPrice = deriveLegacyItemPrice(key, value, formValues);
    if (legacyPrice !== null) {
      return legacyPrice;
    }
  }

  // Last resort: calculate using current pricing (for new entries or legacy data)
  return calculatePriceForItem(key, value);
}

/**
 * Looks up price from the stored pricing snapshot
 */
function getPriceFromSnapshot(key: string, value: any, pricingSnapshot: Record<string, any>): number | null {
  // Handle regular product items
  if (pricingSnapshot[key] && typeof pricingSnapshot[key] === 'object') {
    const itemPrices = pricingSnapshot[key];
    if (itemPrices[value] !== undefined) {
      return itemPrices[value];
    }
  }

  // Handle specialty meats
  if (pricingSnapshot.specialtyMeats) {
    const specialtyMeats = pricingSnapshot.specialtyMeats;
    for (const meatName of Object.keys(specialtyMeats)) {
      const meatPrices = specialtyMeats[meatName];
      if (meatPrices[key] !== undefined) {
        return meatPrices[key];
      }
    }
  }

  return null;
}

/**
 * Attempts to derive individual item prices from legacy capeHideTotal for backward compatibility
 */
function deriveLegacyItemPrice(key: string, value: any, formValues: DeerInputT | DeerT): number | null {
  // Only handle cape and hide items for legacy compatibility
  if (key === 'cape' && value === 'Shoulder mount' && formValues.capeHideTotal) {
    // If there's also a hide, we need to estimate the cape portion
    if (formValues.hide === 'Tanned Hair on') {
      // Legacy total includes both cape and hide
      // We know hide was always $200, so cape = total - $200
      return Math.max(0, formValues.capeHideTotal - 200);
    } else {
      // Only cape, so full total is the cape price
      return formValues.capeHideTotal;
    }
  }

  if (key === 'hide' && value === 'Tanned Hair on') {
    // Hide was consistently $200 in legacy data
    return 200;
  }

  // For entries with NO pricing data at all, fall back to current pricing
  // (This should only happen for very old entries that haven't been migrated)

  // For other items or unsupported combinations, return null to fall back to current pricing
  return null;
}

/**
 * Builds comprehensive historical pricing snapshot for ALL items when creating deer entries
 * This preserves ALL pricing at the time of entry, not just selected items
 */
export function buildHistoricalItemPrices(formValues: DeerInputT): Record<string, number> {
  const historicalPrices: Record<string, number> = {};

  // Process all regular product config items
  for (const key in formValues) {
    if (key in productsConfig) {
      const config = productsConfig[key as keyof ProductsConfig];
      if (config && 'options' in config) {
        const value = formValues[key];
        if (value && value !== '' && value !== 'false') {
          const price = calculatePriceForItem(key, value);
          if (price > 0) {
            historicalPrices[key] = price;
          }
        }
      }
    } else {
      // Handle specialty meats
      const specialtyMeatConfig = findSpecialtyMeatConfig(key);
      if (specialtyMeatConfig) {
        const value = formValues[key];
        if (value && value !== '' && value !== 'false') {
          const price = getSpecialtyMeatPrice(specialtyMeatConfig.name, key, value);
          if (price > 0) {
            historicalPrices[key] = price;
          }
        }
      }
    }
  }

  return historicalPrices;
}

/**
 * Builds a complete pricing configuration snapshot for historical reference
 * This captures the ENTIRE pricing structure at the time of entry
 */
export function buildCompletePricingSnapshot(): Record<string, any> {
  const pricingSnapshot: Record<string, any> = {};

  // Capture all product configs with pricing
  for (const [key, config] of Object.entries(productsConfig)) {
    if (config && typeof config === 'object' && 'options' in config && config.options) {
      const options = config.options as ProductOption[];
      const optionPrices: Record<string, number> = {};

      options.forEach((option) => {
        if (typeof option === 'object' && option.price !== undefined) {
          const value = option.value?.toString() || option.label;
          optionPrices[value] = option.price;
        }
      });

      if (Object.keys(optionPrices).length > 0) {
        pricingSnapshot[key] = optionPrices;
      }
    } else if (config && typeof config === 'object' && 'meats' in config) {
      // Handle specialty meats
      const specialtyMeats: Record<string, Record<string, number>> = {};
      config.meats.forEach((meat) => {
        const meatPrices: Record<string, number> = {};
        meat.options.forEach((option) => {
          if (option.price !== undefined && option.name) {
            meatPrices[option.name] = option.price;
          }
        });
        if (Object.keys(meatPrices).length > 0) {
          specialtyMeats[meat.name] = meatPrices;
        }
      });

      if (Object.keys(specialtyMeats).length > 0) {
        pricingSnapshot[key] = specialtyMeats;
      }
    }
  }

  return pricingSnapshot;
}

export function calculateTotalPrice(formValues: DeerInputT): number {
  // For donations, we still charge for cape/hide options but not processing
  let isDonation = formValues.skinnedOrBoneless === 'Donation';

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

        // For donations, we only charge for cape/hide options, not processing
        if (isDonation && key === 'skinnedOrBoneless') {
          continue; // Skip the processing fee for donations
        }

        const price = calculatePriceForItem(key, formValues[key]);
        total += price;
      }
    } else {
      const specialtyMeatConfig = findSpecialtyMeatConfig(key);
      if (specialtyMeatConfig && !isDonation) {
        // Skip specialty meats for donations
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

  // Handle backward compatibility: parse combined values like "Whole Muscle Jerky - Hot"
  // For hind leg preferences, extract just the preference part
  let normalizedValue = value;
  if ((key === 'hindLegPreference1' || key === 'hindLegPreference2') && typeof value === 'string') {
    if (value.includes('Whole Muscle Jerk')) {
      // Extract "Whole Muscle Jerky" from combined values like "Whole Muscle Jerky - Hot"
      normalizedValue = 'Whole Muscle Jerky';
    }
  }

  if (config.options) {
    let totalPrice = 0;
    if (Array.isArray(normalizedValue)) {
      normalizedValue.forEach((val) => {
        const option = findOptionInConfig(config, val);
        if (option) {
          totalPrice += calculateOptionPrice(option, val);
        }
      });
    } else {
      const option = findOptionInConfig(config, normalizedValue);
      if (option) {
        totalPrice = calculateOptionPrice(option, normalizedValue);
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

/**
 * Price Utility Functions
 *
 * These utilities provide price labels for UI components using CURRENT pricing from productsConfig.
 * Use these for edit forms and dropdowns where you want to show current prices.
 *
 * IMPORTANT: For DISPLAYING prices on existing orders (Summary, Print, DeerTableRow),
 * use getItemPriceForDisplay() from priceCalculations.ts which uses historical pricing.
 */

import { productsConfig, Product, ProductOption, SpecialtyMeatsConfig } from './products';

/**
 * Format a price for display (e.g., "$145" or "$22.50")
 */
export function formatPrice(price: number): string {
  if (price === 0) return '';
  // Show decimal only if needed
  return price % 1 === 0 ? `$${price}` : `$${price.toFixed(2)}`;
}

/**
 * Get the current price for a product option from productsConfig
 * Returns the price number or 0 if not found
 */
export function getCurrentPrice(productKey: string, optionValue: string): number {
  const config = productsConfig[productKey] as Product | undefined;
  if (!config || !config.options) return 0;

  const option = config.options.find(
    (opt) => typeof opt === 'object' && (opt.value === optionValue || opt.label === optionValue)
  ) as ProductOption | undefined;

  return option?.price || 0;
}

/**
 * Get the current price label for a product option (for edit forms/dropdowns)
 * Uses CURRENT pricing from productsConfig
 *
 * @param productKey - The key in productsConfig (e.g., 'euroMount', 'cape', 'hide')
 * @param optionValue - The option value to look up
 * @returns Price label string (e.g., "$145") or empty string if no price
 */
export function getCurrentPriceLabel(productKey: string, optionValue: string): string {
  const price = getCurrentPrice(productKey, optionValue);
  return formatPrice(price);
}

/**
 * Build a label with price suffix for dropdown options
 *
 * @param label - The base label
 * @param price - The price to append
 * @param suffix - Optional suffix like "(Take Today)" or "(Leave Here)"
 */
export function buildLabelWithPrice(label: string, price: number, suffix?: string): string {
  const priceStr = formatPrice(price);
  const parts = [label];
  if (priceStr) parts.push(`- ${priceStr}`);
  if (suffix) parts.push(suffix);
  return parts.join(' ');
}

/**
 * Get dropdown options with current prices for a product (for edit forms)
 * Uses CURRENT pricing from productsConfig
 *
 * @param productKey - The key in productsConfig
 * @returns Array of {value, label} objects for dropdown options
 */
export function getOptionsWithCurrentPrices(
  productKey: string
): Array<{ value: string; label: string }> {
  const config = productsConfig[productKey] as Product | undefined;
  if (!config || !config.options) return [];

  return config.options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    const optionValue = opt.value?.toString() || opt.label;
    const price = opt.price || 0;
    const priceLabel = price > 0 ? ` - ${formatPrice(price)}` : '';
    return {
      value: optionValue,
      label: `${opt.label}${priceLabel}`,
    };
  });
}

/**
 * Cape/Hide option configuration for UI display
 */
export interface CapeHideOptionConfig {
  value: string;
  label: string;
  displayLabel: string;
  priceLabel: string;
  price: number;
  isTakeToday: boolean;
}

/**
 * Get cape/hide options specifically (euroMount, cape, hide)
 * These have complex pricing with isTakeToday flags
 *
 * @param productKey - 'euroMount', 'cape', or 'hide'
 * @returns Array of option configurations with price information
 */
export function getCapeHideOptionsWithPrices(
  productKey: 'euroMount' | 'cape' | 'hide'
): CapeHideOptionConfig[] {
  const config = productsConfig[productKey] as Product | undefined;
  if (!config || !config.options) return [];

  return config.options
    .filter((opt) => typeof opt === 'object')
    .map((opt) => {
      const option = opt as ProductOption;
      const value = option.value?.toString() || '';
      const price = option.price || 0;
      const isTakeToday = option.isTakeToday || false;

      // Build the display label based on whether it's take today or leave here
      let displayLabel = option.label;
      let priceLabel = '';

      if (value === '' || value === 'none' || value === 'false') {
        // "None" or "Select Option" - no price shown
        displayLabel = option.label;
        priceLabel = '';
      } else if (isTakeToday) {
        priceLabel = price > 0 ? `${formatPrice(price)} (Take Today)` : '(Take Today)';
      } else if (price > 0) {
        priceLabel = `${formatPrice(price)} (Leave Here)`;
      }

      return {
        value,
        label: option.label,
        displayLabel,
        priceLabel,
        price,
        isTakeToday,
      };
    });
}

/**
 * Get dropdown options for cape field in admin edit form
 */
export function getCapeDropdownOptions(): Array<{ value: string; label: string }> {
  const options = getCapeHideOptionsWithPrices('cape');
  return options.map((opt) => {
    if (opt.value === '') {
      return { value: '', label: 'Select Option' };
    }
    // Custom labels for cape options in admin form
    if (opt.value === 'Cape for shoulder mount') {
      return { value: opt.value, label: `Additional ${formatPrice(opt.price)}` };
    }
    if (opt.value === 'Shoulder mount') {
      return { value: opt.value, label: `Shoulder Mount - ${formatPrice(opt.price)}` };
    }
    return { value: opt.value, label: opt.label };
  });
}

/**
 * Get dropdown options for hide field in admin edit form
 */
export function getHideDropdownOptions(): Array<{ value: string; label: string }> {
  const options = getCapeHideOptionsWithPrices('hide');
  return options.map((opt) => {
    if (opt.value === '') {
      return { value: '', label: 'Select Option' };
    }
    if (opt.value === 'Save Hide') {
      return { value: opt.value, label: `Save Hide - Take Today - ${formatPrice(opt.price)}` };
    }
    if (opt.value === 'Tanned Hair on') {
      return { value: opt.value, label: `Tanned Hair on - ${formatPrice(opt.price)}` };
    }
    return { value: opt.value, label: opt.label };
  });
}

/**
 * Get dropdown options for euroMount field in admin edit form
 */
export function getEuroMountDropdownOptions(): Array<{ value: string; label: string }> {
  const options = getCapeHideOptionsWithPrices('euroMount');
  return options.map((opt) => {
    if (opt.value === 'none' || opt.value === 'false') {
      return { value: 'false', label: 'Select Option' };
    }
    if (opt.value === 'Keep head') {
      return { value: opt.value, label: 'Keep Head - Take Today' };
    }
    if (opt.value === 'Boiled finished mount') {
      return { value: opt.value, label: `Boiled Finished Mount - ${formatPrice(opt.price)}` };
    }
    if (opt.value === 'Beetles finished mount') {
      return { value: opt.value, label: `Beetles Finished Mount - ${formatPrice(opt.price)}` };
    }
    return { value: opt.value, label: opt.label };
  });
}

/**
 * Get dropdown options for skinnedOrBoneless field
 */
export function getSkinnedOrBonelessOptions(): Array<{ value: string; label: string }> {
  const config = productsConfig.skinnedOrBoneless as Product;
  if (!config || !config.options) return [];

  return config.options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    const option = opt as ProductOption;
    const value = option.value?.toString() || option.label;

    if (value === 'Skinned, Cut, Ground, Vacuum packed') {
      return { value, label: `Skinned, Cut, Ground, Vacuum packed - ${formatPrice(option.price || 0)}` };
    }
    if (value === 'Boneless') {
      return { value, label: 'Boneless, 100% deboned already' };
    }
    if (value === 'Donation') {
      return { value, label: 'Donation - $0' };
    }
    return { value, label: option.label };
  });
}

/**
 * Get dropdown options for groundVenison field
 */
export function getGroundVenisonOptions(): Array<{ value: string; label: string }> {
  const config = productsConfig.groundVenison as Product;
  if (!config || !config.options) return [];

  return config.options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    const option = opt as ProductOption;
    const value = option.value?.toString() || option.label;
    const price = option.price || 0;
    const priceLabel = price > 0 ? ` - ${formatPrice(price)}` : '';

    return { value, label: `${option.label}${priceLabel}` };
  });
}

/**
 * Get dropdown options for hindLegPreference fields
 */
export function getHindLegPreferenceOptions(): Array<{ value: string; label: string }> {
  const config = productsConfig.hindLegPreference1 as Product;
  if (!config || !config.options) return [];

  return config.options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    const option = opt as ProductOption;
    const value = option.value?.toString() || option.label;
    const price = option.price || 0;
    const priceLabel = price > 0 ? ` - ${formatPrice(price)}` : '';

    // Map Grind to Ground Venison for display
    if (value === 'Grind') {
      return { value, label: 'Ground Venison' };
    }

    return { value, label: `${option.label}${priceLabel}` };
  });
}

/**
 * Get the price for tenderized cubed steaks from config
 */
export function getTenderizedCubedSteaksPrice(): number {
  const config = productsConfig.tenderizedCubedSteaks as Product;
  if (!config || !config.options) return 5; // Default fallback

  const option = config.options.find(
    (opt) => typeof opt === 'object' && opt.value === 'true'
  ) as ProductOption | undefined;

  return option?.price || 5;
}

/**
 * Get specialty meat price from config
 */
export function getSpecialtyMeatPriceFromConfig(meatName: string, optionName: string): number {
  const specialtyMeatsConfig = productsConfig.specialtyMeats as SpecialtyMeatsConfig;
  const meat = specialtyMeatsConfig.meats.find((m) => m.name === meatName);
  if (meat) {
    const option = meat.options.find((opt) => opt.name === optionName);
    if (option) {
      return option.price || 0;
    }
  }
  return 0;
}

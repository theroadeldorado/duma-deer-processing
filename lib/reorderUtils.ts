/**
 * Utilities for quick reorder feature
 */

import { DeerT } from './types';

/**
 * Fields that are customer-specific and should be reused from previous orders
 */
export const CUSTOMER_INFO_FIELDS = [
  'name',
  'firstName',
  'lastName',
  'phone',
  'fullAddress',
  'address',
  'city',
  'state',
  'zip',
  'communication',
] as const;

/**
 * Fields that are deer-specific and should NEVER be reused (always fresh)
 */
export const DEER_SPECIFIC_FIELDS = [
  'tagNumber',
  'buckOrDoe',
  'stateHarvestedIn',
  'dateHarvested',
  'dateFound',
] as const;

/**
 * System fields that should not be copied to new orders
 */
export const SYSTEM_FIELDS = [
  '_id',
  'createdAt',
  'updatedAt',
  'hasPrinted',
  'deposit',
  'capeHideDeposit',
  'capeHideTotal',
  'amountPaid',
  'totalPrice',
  'historicalItemPrices',
  'pricingSnapshot',
] as const;

/**
 * Cape/Hide fields that may need special handling
 * (user might want different cape/hide options per deer)
 */
export const CAPE_HIDE_FIELDS = [
  'cape',
  'hide',
  'euroMount',
  'capeHideNotes',
  'shoulderMountHeadPosition',
  'shoulderMountEarPosition',
  'shoulderMountSpecialInstructions',
  'hideCondition',
  'facialFeatures',
  'rackId',
  'capeId',
  'capeMorseCode',
  'approxNeckMeasurement',
  'formOrdered',
] as const;

/**
 * Processing preference fields (everything else)
 */
export const PROCESSING_PREFERENCE_FIELDS = [
  'skinnedOrBoneless',
  'skinnedBonelessNotes',
  'quickOption',
  'backStrapsPreference',
  'backStrap2Preference',
  'backStrapNotes',
  'hindLegPreference1',
  'hindLegPreference2',
  'hindLegJerky1',
  'hindLegJerky2',
  'hindLegJerky1Flavor',
  'hindLegJerky2Flavor',
  'tenderizedCubedSteaks',
  'hindLegNotes',
  'roast',
  'roastNotes',
  'groundVenison',
  'groundVenisonAmount',
  'groundVenisonNotes',
] as const;

/**
 * Specialty meat fields - these are dynamically extracted
 */
export const SPECIALTY_MEAT_FIELD_PATTERNS = [
  'trailBologna',
  'smokedJalapenoCheddarBrats',
  'garlicRingBologna',
  'summerSausage',
  'smokedKielbasa',
  'italianSausageLinks',
  'countryBreakfastSausage',
  'babyLinks',
  'snackSticks',
  'hotDogs',
  'jerkyRestructured',
] as const;

/**
 * Section mapping for editing in quick reorder flow
 */
export type EditableSection =
  | 'processing-type'
  | 'cape-hide'
  | 'cutting-preferences'
  | 'ground-venison'
  | 'specialty-meats';

/**
 * Extracts customer information from an order
 */
export function extractCustomerInfo(order: DeerT): Partial<DeerT> {
  const customerInfo: Partial<DeerT> = {};

  for (const field of CUSTOMER_INFO_FIELDS) {
    if (order[field] !== undefined) {
      (customerInfo as any)[field] = order[field];
    }
  }

  return customerInfo;
}

/**
 * Extracts processing preferences from an order (excludes customer/deer/system fields)
 */
export function extractReorderPreferences(order: DeerT): Partial<DeerT> {
  const preferences: Partial<DeerT> = {};

  // Copy processing preference fields
  for (const field of PROCESSING_PREFERENCE_FIELDS) {
    if (order[field] !== undefined) {
      (preferences as any)[field] = order[field];
    }
  }

  // Copy cape/hide fields
  for (const field of CAPE_HIDE_FIELDS) {
    if (order[field] !== undefined) {
      (preferences as any)[field] = order[field];
    }
  }

  // Copy specialty meat fields (any field that matches patterns or ends with 'Notes')
  for (const key of Object.keys(order)) {
    const isSpecialtyMeat = SPECIALTY_MEAT_FIELD_PATTERNS.some(
      (pattern) => key.startsWith(pattern) || key.toLowerCase().includes(pattern.toLowerCase())
    );

    if (isSpecialtyMeat && !SYSTEM_FIELDS.includes(key as any)) {
      (preferences as any)[key] = order[key];
    }
  }

  return preferences;
}

/**
 * Builds complete form data by merging customer info, preferences, and new deer info
 */
export function buildReorderFormData(
  customerInfo: Partial<DeerT>,
  preferences: Partial<DeerT>,
  deerInfo: Partial<DeerT>
): Partial<DeerT> {
  return {
    ...customerInfo,
    ...preferences,
    ...deerInfo,
  };
}

/**
 * Gets a summary of processing preferences for display
 */
export function getPreferencesSummary(order: DeerT): {
  processingType: string;
  capeHide: { cape: string; hide: string; euroMount: string };
  cutting: {
    backStraps: string;
    hindLeg1: string;
    hindLeg2: string;
    roast: string;
  };
  groundVenison: { type: string; amount: string };
  specialtyMeats: Array<{ name: string; quantity: number | string }>;
} {
  const specialtyMeats: Array<{ name: string; quantity: number | string }> = [];

  // Extract specialty meats with quantities
  const specialtyMeatLabels: Record<string, string> = {
    trailBolognaRegular: 'Regular Trail Bologna',
    trailBolognaCheddarCheese: 'Cheddar Cheese Trail Bologna',
    trailBolognaHotPepperJackCheese: 'Hot Pepper Jack Cheese Trail Bologna',
    smokedJalapenoCheddarBrats: 'Smoked Jalapeno Cheddar Brats',
    garlicRingBologna: 'Garlic Ring Bologna',
    summerSausageMild: 'Mild Summer Sausage',
    summerSausageHot: 'Hot Summer Sausage',
    smokedKielbasaSausage: 'Smoked Kielbasa Sausage',
    italianSausageLinksMild: 'Mild Italian Sausage Links',
    italianSausageLinksHot: 'Hot Italian Sausage Links',
    countryBreakfastSausage: 'Country Breakfast Sausage',
    babyLinksCountry: 'Country Breakfast Links',
    babyLinksMaple: 'Maple Breakfast Links',
    snackSticksRegular: 'Regular Snack Sticks',
    snackSticksCheddarCheese: 'Cheddar Cheese Snack Sticks',
    snackSticksHotPepperJackCheese: 'Hot Pepper Jack Cheese Snack Sticks',
    snackSticksHotHotPepperJackCheese: 'Hot Hot Pepper Jack Cheese Snack Sticks',
    snackSticksHoneyBBQ: 'Honey BBQ Snack Sticks',
    hotDogsRegular: 'Regular Hot Dogs',
    hotDogsCheddarCheese: 'Cheddar Cheese Hot Dogs',
    hotDogsHotPepperJackCheese: 'Hot Pepper Jack Cheese Hot Dogs',
    jerkyRestructuredHot: 'Hillbilly Hot Jerky Restructured',
    jerkyRestructuredMild: 'Appalachian Mild Jerky Restructured',
    jerkyRestructuredTeriyaki: 'Teriyaki Jerky Restructured',
  };

  for (const [key, label] of Object.entries(specialtyMeatLabels)) {
    const value = order[key];
    if (value && value !== 'false' && value !== '0' && value !== 0) {
      specialtyMeats.push({
        name: label,
        quantity: typeof value === 'number' ? value : parseInt(value as string, 10) || value,
      });
    }
  }

  return {
    processingType: order.skinnedOrBoneless || '',
    capeHide: {
      cape: order.cape?.toString() || '',
      hide: order.hide?.toString() || '',
      euroMount: order.euroMount || '',
    },
    cutting: {
      backStraps: order.backStrapsPreference || '',
      hindLeg1: order.hindLegPreference1 || '',
      hindLeg2: order.hindLegPreference2 || '',
      roast: order.roast || '',
    },
    groundVenison: {
      type: order.groundVenison || '',
      amount: order.groundVenisonAmount || '',
    },
    specialtyMeats,
  };
}

/**
 * Gets the fields that belong to a specific editable section
 */
export function getSectionFields(section: EditableSection): string[] {
  switch (section) {
    case 'processing-type':
      return ['skinnedOrBoneless', 'skinnedBonelessNotes', 'quickOption'];

    case 'cape-hide':
      return [...CAPE_HIDE_FIELDS];

    case 'cutting-preferences':
      return [
        'backStrapsPreference',
        'backStrap2Preference',
        'backStrapNotes',
        'hindLegPreference1',
        'hindLegPreference2',
        'hindLegJerky1',
        'hindLegJerky2',
        'hindLegJerky1Flavor',
        'hindLegJerky2Flavor',
        'tenderizedCubedSteaks',
        'hindLegNotes',
        'roast',
        'roastNotes',
      ];

    case 'ground-venison':
      return ['groundVenison', 'groundVenisonAmount', 'groundVenisonNotes'];

    case 'specialty-meats':
      return Object.keys({
        trailBolognaRegular: 1,
        trailBolognaCheddarCheese: 1,
        trailBolognaHotPepperJackCheese: 1,
        smokedJalapenoCheddarBrats: 1,
        garlicRingBologna: 1,
        summerSausageMild: 1,
        summerSausageHot: 1,
        smokedKielbasaSausage: 1,
        italianSausageLinksMild: 1,
        italianSausageLinksHot: 1,
        countryBreakfastSausage: 1,
        babyLinksCountry: 1,
        babyLinksMaple: 1,
        snackSticksRegular: 1,
        snackSticksCheddarCheese: 1,
        snackSticksHotPepperJackCheese: 1,
        snackSticksHotHotPepperJackCheese: 1,
        snackSticksHoneyBBQ: 1,
        hotDogsRegular: 1,
        hotDogsCheddarCheese: 1,
        hotDogsHotPepperJackCheese: 1,
        jerkyRestructuredHot: 1,
        jerkyRestructuredMild: 1,
        jerkyRestructuredTeriyaki: 1,
        trailBolognaNotes: 1,
        garlicRingBolognaNotes: 1,
        summerSausageNotes: 1,
        smokedKielbasaSausageNotes: 1,
        italianSausageLinksNotes: 1,
        countryBreakfastSausageNotes: 1,
        babyLinksNotes: 1,
        snackSticksNotes: 1,
        hotDogsNotes: 1,
        jerkyRestructuredNotes: 1,
      });

    default:
      return [];
  }
}

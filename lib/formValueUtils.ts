/**
 * Utility functions for grouping and processing form values for display
 * Used by Summary.tsx and PrintDeerDetails.tsx
 */

import { productsConfig } from '@/lib/products';
import {
  findSpecialtyMeatConfig,
  getSpecialtyMeatPrice,
  getItemPriceForDisplay,
} from '@/lib/priceCalculations';

// Shared type definitions
export interface ProductOption {
  value?: string | number;
  label: string;
  price?: number;
  name?: string;
  pricePer5lb?: boolean;
  notes?: boolean;
}

export interface Product {
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

export interface SectionEntry {
  key: string;
  label: string;
  value: string | number;
  price: number;
  pricePer5lb?: boolean;
  notes?: boolean;
}

export interface SectionedValues {
  [section: string]: SectionEntry[];
}

export interface GroupFormValuesResult {
  sectionedValues: SectionedValues;
  hasEvenly: boolean;
}

/**
 * Process hind legs form values for display
 * Handles jerky flavors, tenderized steaks, and pricing
 */
export function processHindLegs(formValues: Record<string, any>): Array<{
  key: string;
  label: string;
  value: string;
  price: number;
  pricePer5lb?: boolean;
  notes?: boolean;
}> {
  const entries: Array<{
    key: string;
    label: string;
    value: string;
    price: number;
    pricePer5lb?: boolean;
    notes?: boolean;
  }> = [];

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
      // Only show tenderized price if leg 1 is not steaks (to avoid double charging)
      const tenderized = formValues.tenderizedCubedSteaks;
      const leg1IsAlsoSteaks = formValues.hindLegPreference1 === 'Steaks';
      if (tenderized === 'true') {
        displayValue = 'Steaks - Tenderized Cubed';
        price = leg1IsAlsoSteaks ? 0 : 5; // Only charge once for tenderized
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

/**
 * Process cape, hide, and euro mount options for display
 * Returns entries with proper display values and pricing
 */
export function processCapeHideOptions(formValues: Record<string, any>): Array<{
  key: string;
  label: string;
  value: string;
  price: number;
  pricePer5lb?: boolean;
  notes?: boolean;
}> {
  const entries: Array<{
    key: string;
    label: string;
    value: string;
    price: number;
    pricePer5lb?: boolean;
    notes?: boolean;
  }> = [];

  // Process Cape options
  const cape = formValues.cape;
  if (cape && cape !== '') {
    let displayValue = cape;
    let price = 0;

    if (cape === 'Cape for shoulder mount') {
      displayValue = 'Keep Cape (Take Today)';
      price = 50;
    } else if (cape === 'Shoulder mount') {
      displayValue = 'Shoulder Mount';
      // Use historical pricing for display
      price = getItemPriceForDisplay('cape', cape, formValues);
    }

    entries.push({
      key: 'cape',
      label: 'Cape Option',
      value: displayValue,
      price: price,
    });

    // Add shoulder mount details if applicable
    if (cape === 'Shoulder mount') {
      const headPosition = formValues.shoulderMountHeadPosition;
      if (headPosition) {
        entries.push({
          key: 'shoulderMountHeadPosition',
          label: 'Head Position',
          value: headPosition,
          price: 0,
        });
      }

      const specialInstructions = formValues.shoulderMountSpecialInstructions;
      if (specialInstructions && specialInstructions.trim() !== '') {
        entries.push({
          key: 'shoulderMountSpecialInstructions',
          label: 'Special Instructions',
          value: specialInstructions,
          price: 0,
        });
      }
    }
  }

  // Process Hide options
  const hide = formValues.hide;
  if (hide && hide !== '') {
    let displayValue = hide;
    let price = 0;

    if (hide === 'Save Hide') {
      displayValue = 'Save Hide (Take Today)';
      price = 15;
    } else if (hide === 'Tanned Hair on') {
      displayValue = 'Tanned Hair on';
      // Use historical pricing for display
      price = getItemPriceForDisplay('hide', hide, formValues);
    }

    entries.push({
      key: 'hide',
      label: 'Hide Option',
      value: displayValue,
      price: price,
    });
  }

  // Process Euro Mount options
  const euroMount = formValues.euroMount;
  if (euroMount && euroMount !== 'false' && euroMount !== '') {
    let displayValue = euroMount;
    let price = 0;

    if (euroMount === 'Keep head') {
      displayValue = 'Keep Head (Take Today)';
      price = 0;
    } else if (euroMount === 'Boiled finished mount') {
      displayValue = 'Boiled Finished Mount';
      // Use historical pricing for display
      price = getItemPriceForDisplay('euroMount', euroMount, formValues);
    } else if (euroMount === 'Beetles finished mount') {
      displayValue = 'Beetles Finished Mount';
      // Use historical pricing for display
      price = getItemPriceForDisplay('euroMount', euroMount, formValues);
    }

    entries.push({
      key: 'euroMount',
      label: 'Euro Mount',
      value: displayValue,
      price: price,
    });
  }

  return entries;
}

/**
 * Build cutting instructions entries in the correct order
 * Order: skinnedOrBoneless, cape, euroMount, hide, shoulder mount details, hind legs, others
 */
export function buildCuttingInstructionsInOrder(
  formValues: Record<string, any>,
  capeHideEntries: SectionEntry[],
  hindLegEntries: SectionEntry[],
  sectionedValues: SectionedValues
): SectionEntry[] {
  const orderedEntries: SectionEntry[] = [];

  // 1. skinnedOrBoneless first
  const existingCuttingInstructions = sectionedValues['Cutting Instructions'] || [];
  const skinnedOrBonelessEntry = existingCuttingInstructions.find((entry) => entry.key === 'skinnedOrBoneless');
  if (skinnedOrBonelessEntry) {
    orderedEntries.push({
      ...skinnedOrBonelessEntry,
      value: String(skinnedOrBonelessEntry.value), // Ensure value is a string
    });
  }

  // 2. cape second
  const capeEntry = capeHideEntries.find((entry) => entry.key === 'cape');
  if (capeEntry) {
    orderedEntries.push(capeEntry);
  }

  // 3. euroMount third
  const euroMountEntry = capeHideEntries.find((entry) => entry.key === 'euroMount');
  if (euroMountEntry) {
    orderedEntries.push(euroMountEntry);
  }

  // 4. hide fourth
  const hideEntry = capeHideEntries.find((entry) => entry.key === 'hide');
  if (hideEntry) {
    orderedEntries.push(hideEntry);
  }

  // 5. Add remaining cape/hide entries (like shoulder mount details)
  const remainingCapeHideEntries = capeHideEntries.filter(
    (entry) => entry.key !== 'cape' && entry.key !== 'euroMount' && entry.key !== 'hide'
  );
  orderedEntries.push(...remainingCapeHideEntries);

  // 6. Add hind leg entries
  orderedEntries.push(...hindLegEntries);

  // 7. Add any other existing cutting instructions entries (except skinnedOrBoneless which we already added)
  const otherCuttingInstructionsEntries = existingCuttingInstructions
    .filter((entry) => entry.key !== 'skinnedOrBoneless')
    .map((entry) => ({
      ...entry,
      value: String(entry.value), // Ensure value is a string
    }));
  orderedEntries.push(...otherCuttingInstructionsEntries);

  return orderedEntries;
}

// Fields that should be skipped in groupFormValuesBySections
const HIND_LEG_RELATED_FIELDS = [
  'hindLegPreference1',
  'hindLegPreference2',
  'tenderizedCubedSteaks',
  'hindLegJerky1Flavor',
  'hindLegJerky2Flavor',
];

const CAPE_HIDE_FIELDS = [
  'cape',
  'hide',
  'euroMount',
  'shoulderMountHeadPosition',
  'shoulderMountEarPosition',
  'shoulderMountSpecialInstructions',
];

/**
 * Check if a key is a hind leg related field
 */
function isHindLegRelatedField(key: string): boolean {
  return key.startsWith('hindLeg') || HIND_LEG_RELATED_FIELDS.includes(key);
}

/**
 * Check if a key is a cape/hide related field
 */
function isCapeHideField(key: string): boolean {
  return CAPE_HIDE_FIELDS.includes(key);
}

/**
 * Options for groupFormValuesBySections
 */
export interface GroupFormValuesOptions {
  /**
   * Whether to include cape/hide entries via processCapeHideOptions
   * Summary.tsx uses this, PrintDeerDetails.tsx does not
   */
  includeCapeHideProcessing?: boolean;
  /**
   * Whether to apply boneless ground venison price adjustments
   * PrintDeerDetails.tsx uses this, Summary.tsx does not
   */
  applyBonelessGroundVenisonPricing?: boolean;
  /**
   * Whether to reorder contact info to have name and phone first
   * PrintDeerDetails.tsx uses this
   */
  reorderContactInfo?: boolean;
}

/**
 * Group form values by sections for display
 * This is the main utility function used by both Summary and PrintDeerDetails components
 */
export function groupFormValuesBySections(
  formValues: Record<string, any>,
  options: GroupFormValuesOptions = {}
): GroupFormValuesResult {
  const {
    includeCapeHideProcessing = false,
    applyBonelessGroundVenisonPricing = false,
    reorderContactInfo = false,
  } = options;

  const sectionedValues: SectionedValues = {};
  let hasEvenly = false;

  // Process cape/hide entries if option is enabled
  const capeHideEntries = includeCapeHideProcessing ? processCapeHideOptions(formValues) : [];
  const hindLegEntries = processHindLegs(formValues);

  Object.keys(formValues).forEach((key) => {
    // Skip quickOption from appearing in summary
    if (key === 'quickOption') {
      return;
    }

    // Skip all hind leg related fields - they're handled by processHindLegs()
    if (isHindLegRelatedField(key)) {
      return;
    }

    // Skip cape/hide/mount fields if cape/hide processing is enabled (they're handled separately)
    if (includeCapeHideProcessing && isCapeHideField(key)) {
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

      // Apply boneless ground venison pricing adjustment if option is enabled
      if (applyBonelessGroundVenisonPricing && key === 'groundVenison' && formValues.skinnedOrBoneless === 'Boneless') {
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
          sectionedValues[section].push({
            key,
            label: specialtyMeatConfig.label,
            value,
            price,
            pricePer5lb,
            notes: specialtyMeatConfig.notes,
          });
        }
      }
    }
  });

  // Build Cutting Instructions in manual order if cape/hide processing is enabled
  if (includeCapeHideProcessing) {
    const cuttingInstructionsEntries = buildCuttingInstructionsInOrder(
      formValues,
      capeHideEntries,
      hindLegEntries,
      sectionedValues
    );
    if (cuttingInstructionsEntries.length > 0) {
      sectionedValues['Cutting Instructions'] = cuttingInstructionsEntries;
    }
  } else {
    // Add processed hind leg entries directly to cutting instructions
    if (hindLegEntries.length > 0) {
      const section = 'Cutting Instructions';
      sectionedValues[section] = sectionedValues[section] || [];
      sectionedValues[section].push(...hindLegEntries);
    }
  }

  // Reorder contact info if option is enabled
  if (reorderContactInfo) {
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
  }

  return { sectionedValues, hasEvenly };
}

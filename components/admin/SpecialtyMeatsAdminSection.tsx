import React from 'react';
import SpecialtyMeat from '@/components/SpecialtyMeat';
import Textarea from '@/components/Textarea';
import { productsConfig, SpecialtyMeatsConfig, SpecialtyMeat as SpecialtyMeatType } from '@/lib/products';
import { FormSubSection } from './FormSection';

/**
 * Mapping of specialty meat names to their corresponding notes field names.
 * This allows the notes fields to be linked to the correct specialty meat.
 */
const SPECIALTY_MEAT_NOTES_MAP: Record<string, string> = {
  'Trail Bologna': 'trailBolognaNotes',
  'Garlic Ring Bologna': 'garlicRingBolognaNotes',
  'Summer Sausage': 'summerSausageNotes',
  'Smoked Kielbasa Sausage': 'smokedKielbasaSausageNotes',
  'Italian Sausage Links': 'italianSausageLinksNotes',
  'Country Breakfast Sausage': 'countryBreakfastSausageNotes',
  'Breakfast Links': 'babyLinksNotes',
  'Snack Sticks': 'snackSticksNotes',
  'Hot Dogs': 'hotDogsNotes',
  'Jerky Restructured': 'jerkyRestructuredNotes',
  // Note: Smoked Jalapeno Cheddar Brats does not have a notes field in the original
};

/**
 * Get the specialty meats configuration from productsConfig.
 * Returns the meats array from the specialtyMeats section.
 */
function getSpecialtyMeatsConfig(): SpecialtyMeatType[] {
  const specialtyMeatsConfig = productsConfig.specialtyMeats as SpecialtyMeatsConfig;
  return specialtyMeatsConfig?.meats || [];
}

/**
 * Get the notes field name for a specialty meat.
 * Returns undefined if the meat doesn't have a notes field.
 */
function getNotesFieldName(meatName: string): string | undefined {
  return SPECIALTY_MEAT_NOTES_MAP[meatName];
}

interface SpecialtyMeatsAdminSectionProps {
  /**
   * Optional className for the wrapper div
   */
  className?: string;
}

/**
 * Data-driven admin section for specialty meats.
 * Renders all specialty meats from productsConfig with their options and notes fields.
 *
 * When adding a new specialty meat:
 * 1. Add the meat to productsConfig.specialtyMeats.meats in lib/products.ts
 * 2. If the meat needs a notes field, add the notes field to productsConfig and update SPECIALTY_MEAT_NOTES_MAP
 * 3. No changes needed to this component or edit.tsx
 */
export default function SpecialtyMeatsAdminSection({ className }: SpecialtyMeatsAdminSectionProps) {
  const specialtyMeats = getSpecialtyMeatsConfig();

  return (
    <div className={className}>
      {specialtyMeats.map((meat) => {
        const notesFieldName = getNotesFieldName(meat.name);

        // Transform options to match the SpecialtyMeat component's expected format
        // The productsConfig uses full labels, but the admin display uses short labels
        const displayOptions = meat.options.map((option) => ({
          name: option.name || '',
          label: getShortLabel(option.label || '', meat.name),
          price: option.price || 0,
        }));

        return (
          <FormSubSection key={meat.name} title={meat.name}>
            <SpecialtyMeat
              admin
              name={meat.name}
              image={meat.image}
              options={displayOptions}
            />
            {notesFieldName && (
              <div className='col-span-3'>
                <Textarea rows={2} name={notesFieldName} label='Special Instructions' />
              </div>
            )}
          </FormSubSection>
        );
      })}
    </div>
  );
}

/**
 * Extract a short label from the full product label.
 * For example: "Regular Trail Bologna" -> "Regular"
 * If the label equals the meat name, returns empty string (single option meats).
 */
function getShortLabel(fullLabel: string, meatName: string): string {
  // If the label is just the meat name (single option meats), return empty
  if (fullLabel === meatName) {
    return '';
  }

  // Handle special cases
  const labelMappings: Record<string, Record<string, string>> = {
    'Trail Bologna': {
      'Regular Trail Bologna': 'Regular',
      'Cheddar Cheese Trail Bologna': 'Cheddar Cheese',
      'Hot Pepper Jack Cheese Trail Bologna': 'Hot Pepper Jack Cheese',
    },
    'Summer Sausage': {
      'Mild Summer Sausage': 'Mild',
      'Hot Summer Sausage': 'Hot',
    },
    'Italian Sausage Links': {
      'Mild Italian Sausage Links': 'Mild',
      'Hot Italian Sausage Links': 'Hot',
    },
    'Breakfast Links': {
      'Country Breakfast Links': 'Country',
      'Maple Breakfast Links': 'Maple',
    },
    'Snack Sticks': {
      'Regular Snack Sticks': 'Regular',
      'Cheddar Cheese Snack Sticks': 'Cheddar Cheese',
      'Hot Pepper Jack Cheese Snack Sticks': 'Hot Pepper Jack Cheese',
      'Hot Hot Pepper Jack Cheese Snack Sticks': 'Hot Hot Pepper Jack Cheese',
    },
    'Hot Dogs': {
      'Regular Hot Dogs': 'Regular',
      'Cheddar Cheese Hot Dogs': 'Cheddar Cheese',
      'Hot Pepper Jack Cheese Hot Dogs': 'Hot Pepper Jack Cheese',
    },
    'Jerky Restructured': {
      'Hillbilly Hot Jerky Restructured': 'Hot',
      'Appalachian Mild Jerky Restructured': 'Mild',
      'Teriyaki Jerky Restructured': 'Teriyaki',
    },
    'Country Breakfast Sausage': {
      'Country Breakfast Sausage': 'Country Breakfast Sausage',
    },
  };

  // Check if we have a mapping for this meat and label
  if (labelMappings[meatName] && labelMappings[meatName][fullLabel]) {
    return labelMappings[meatName][fullLabel];
  }

  // Default: try to extract by removing the meat name from the label
  // This handles cases like "Smoked Jalapeno Cheddar Brats" -> ""
  const shortLabel = fullLabel.replace(meatName, '').trim();
  return shortLabel || '';
}

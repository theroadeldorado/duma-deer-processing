import { ProfileT, DeerT } from 'lib/types';
import { parseAsync } from 'json2csv';
import { admin } from 'lib/firebaseAdmin';
import fs from 'fs/promises';
import dayjs from 'dayjs';
import { productsConfig, SpecialtyMeatsConfig, Product } from 'lib/products';

/**
 * Type for CSV field configuration
 */
type CsvFieldConfig = Record<string, string>;

/**
 * Helper to check if a config item is a SpecialtyMeatsConfig
 */
const isSpecialtyMeatsConfig = (item: Product | SpecialtyMeatsConfig): item is SpecialtyMeatsConfig => {
  return 'meats' in item;
};

/**
 * Extract specialty meat field names and labels from productsConfig
 * Returns a map of fieldName -> label for all specialty meat options
 */
const getSpecialtyMeatFields = (): CsvFieldConfig => {
  const fields: CsvFieldConfig = {};
  const specialtyMeatsConfig = productsConfig.specialtyMeats;

  if (specialtyMeatsConfig && isSpecialtyMeatsConfig(specialtyMeatsConfig)) {
    for (const meat of specialtyMeatsConfig.meats) {
      for (const option of meat.options) {
        if (option.name) {
          // Use the option's label, removing emoji prefixes if present
          const cleanLabel = option.label.replace(/^[^\w\s]+\s*/, '');
          fields[option.name] = cleanLabel;
        }
      }
    }
  }

  return fields;
};

/**
 * Extract regular product fields from productsConfig (non-specialty meats)
 * Returns a map of fieldName -> label
 */
const getProductFields = (): CsvFieldConfig => {
  const fields: CsvFieldConfig = {};

  for (const [key, config] of Object.entries(productsConfig)) {
    if (key === 'specialtyMeats') continue;
    if (!isSpecialtyMeatsConfig(config)) {
      fields[key] = config.label;
    }
  }

  return fields;
};

/**
 * Base field configuration for CSV export.
 * This defines the exact order and labels for backwards compatibility.
 * Fields listed here will appear in this exact order.
 * Any new fields from productsConfig not listed here will be appended automatically.
 */
const BASE_CSV_FIELDS: CsvFieldConfig = {
  // Meta and contact fields (fixed order for backwards compatibility)
  createdAt: 'Date',
  firstName: 'First Name',
  lastName: 'Last Name',
  tagNumber: 'Tag #',
  address: 'Address',
  city: 'City',
  state: 'State',
  zip: 'Zip',
  phone: 'Phone',
  communication: 'Communication',
  stateHarvestedIn: 'Harvested In',
  buckOrDoe: 'Doe/Buck',
  dateHarvested: 'Date Harvested',
  dateFound: 'Date Found',

  // Cape/Hide options
  cape: 'Keep Cape',
  hide: 'Keep Hide',
  euroMount: 'Euro Mount',
  capeHideNotes: 'Cape/Hide Notes',
  capeHideTotal: 'Cape/Hide Total',

  // Shoulder mount details
  shoulderMountHeadPosition: 'Shoulder Mount Head Position',
  shoulderMountEarPosition: 'Shoulder Mount Ear Position',
  shoulderMountSpecialInstructions: 'Shoulder Mount Special Instructions',
  hideCondition: 'Hide Condition',
  facialFeatures: 'Facial Features',
  rackId: 'Rack ID',
  capeId: 'Cape ID',
  capeMorseCode: 'Cape Morse Code',
  approxNeckMeasurement: 'Approx Neck Measurement',
  formOrdered: 'Form Ordered',

  // Processing options
  skinnedOrBoneless: 'Skinned/Boneless',
  skinnedBonelessNotes: 'Skinned/Boneless Notes',
  quickOption: 'Processing Option',

  // Cutting preferences
  backStrapsPreference: 'Back Straps 1 Preference',
  backStrap2Preference: 'Back Straps 2 Preference',
  backStrapNotes: 'Back Straps Notes',
  hindLegPreference1: 'Hind Leg Preference 1',
  hindLegJerky1: 'Hind Leg 1 Jerky',
  hindLegJerky1Flavor: 'Hind Leg 1 Jerky Flavor',
  hindLegPreference2: 'Hind Leg Preference 2',
  hindLegJerky2: 'Hind Leg 2 Jerky',
  hindLegJerky2Flavor: 'Hind Leg 2 Jerky Flavor',
  hindLegNotes: 'Hind Leg Notes',
  tenderizedCubedSteaks: 'Tenderized Cubed Steaks',
  roast: 'Roast',
  roastNotes: 'Roast Notes',
  groundVenison: 'Ground Venison',
  groundVenisonAmount: 'Ground Venison Amount',
  groundVenisonNotes: 'Ground Venison Notes',
};

/**
 * Fields that should appear at the end of the CSV (after specialty meats)
 */
const TRAILING_CSV_FIELDS: CsvFieldConfig = {
  recapNotes: 'Recap Notes',
  deposit: 'Deposit',
  capeHideDeposit: 'Cape/Hide Deposit',
  amountPaid: 'Amount Paid',
  totalPrice: 'Total Price',
  hasPrinted: 'Has Printed',
  _id: 'ID',
};

/**
 * Fields to exclude from auto-generation (internal or already handled)
 */
const EXCLUDED_FIELDS = new Set([
  'name', // Combined into firstName/lastName
  'fullAddress', // Split into address/city/state/zip
  'specialtyMeats', // Not a direct field
  'historicalItemPrices', // Internal pricing data (complex object)
  'pricingSnapshot', // Internal pricing data (complex object)
  '__v', // Mongoose version key
  'updatedAt', // System field
]);

/**
 * Build the complete CSV field configuration by combining:
 * 1. Base fields (fixed order for backwards compatibility)
 * 2. Specialty meat fields from productsConfig (auto-generated)
 * 3. Any new product fields from productsConfig not in base fields
 * 4. Trailing fields (recap notes, prices, ID)
 */
const buildCsvFields = (): CsvFieldConfig => {
  const fields: CsvFieldConfig = { ...BASE_CSV_FIELDS };

  // Get all specialty meat fields from config
  const specialtyMeatFields = getSpecialtyMeatFields();

  // Add specialty meat fields in the order they appear in config
  for (const [key, label] of Object.entries(specialtyMeatFields)) {
    if (!fields[key]) {
      fields[key] = label;
    }
  }

  // Add notes fields for specialty meats that aren't already included
  const productFields = getProductFields();
  for (const [key, label] of Object.entries(productFields)) {
    // Only add notes fields that aren't already in base fields
    if (key.endsWith('Notes') && !fields[key] && !EXCLUDED_FIELDS.has(key)) {
      fields[key] = label;
    }
  }

  // Add any other new fields from productsConfig that aren't already included
  for (const [key, label] of Object.entries(productFields)) {
    if (!fields[key] && !EXCLUDED_FIELDS.has(key) && !TRAILING_CSV_FIELDS[key]) {
      fields[key] = label;
    }
  }

  // Add trailing fields at the end
  for (const [key, label] of Object.entries(TRAILING_CSV_FIELDS)) {
    fields[key] = label;
  }

  return fields;
};

/**
 * Get the CSV fields for deer export.
 * This is memoized since the configuration doesn't change at runtime.
 */
let cachedCsvFields: CsvFieldConfig | null = null;
const getCsvFields = (): CsvFieldConfig => {
  if (!cachedCsvFields) {
    cachedCsvFields = buildCsvFields();
  }
  return cachedCsvFields;
};

/**
 * Sanitize a value for CSV export
 * Handles complex objects, nulls, and special types
 */
const sanitizeValue = (value: unknown): string | number | boolean | null | undefined => {
  if (value === null || value === undefined) {
    return '';
  }

  // Handle Map objects (like historicalItemPrices)
  if (value instanceof Map) {
    return JSON.stringify(Object.fromEntries(value));
  }

  // Handle plain objects (like pricingSnapshot)
  if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
    return JSON.stringify(value);
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }

  return value as string | number | boolean;
};

/**
 * Collect all unique field names from the data
 * This ensures new fields are automatically included
 */
const collectFieldsFromData = (data: DeerT[]): Set<string> => {
  const fields = new Set<string>();
  for (const record of data) {
    for (const key of Object.keys(record)) {
      fields.add(key);
    }
  }
  return fields;
};

export const exportDeers = async (data: DeerT[]) => {
  const configuredFields = getCsvFields();

  // Collect all unique fields from the actual data
  const dataFields = collectFieldsFromData(data);

  // Add any fields from the data that aren't in the configuration
  // This ensures new fields are automatically exported
  const allFields: CsvFieldConfig = { ...configuredFields };
  Array.from(dataFields).forEach((fieldName) => {
    if (!allFields[fieldName] && !EXCLUDED_FIELDS.has(fieldName)) {
      // Convert camelCase to Title Case for the label
      const label = fieldName
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
      allFields[fieldName] = label;
    }
  });

  const formattedData = data.map((record) => {
    const formatted: Record<string, unknown> = {};

    // Process all fields
    for (const key of Object.keys(record)) {
      if (EXCLUDED_FIELDS.has(key)) continue;

      const value = record[key];

      // Special handling for dates
      if (key === 'createdAt' && value) {
        formatted[key] = dayjs(value).format('MM/DD/YYYY');
      } else if ((key === 'dateHarvested' || key === 'dateFound') && value) {
        // Format date fields if they exist
        formatted[key] = value;
      } else {
        formatted[key] = sanitizeValue(value);
      }
    }

    return formatted;
  });

  return saveCSV('Deers', allFields, formattedData);
};

export const exportUsers = async (data: ProfileT[]) => {
  const fields = {
    _id: 'ID',
    name: 'Name',
    email: 'Email',
    createdAt: 'Joined',
  };

  const formattedData = data.map((data) => {
    return {
      ...data,
      _id: data._id.toString(),
      createdAt: dayjs(data.createdAt).format('MM/DD/YYYY'),
    };
  });

  return saveCSV('Users', fields, formattedData);
};

export const saveCSV = async (prefix: string, fields: any, data: any) => {
  const formattedFields = Object.keys(fields).map((key) => {
    return { label: fields[key], value: key };
  });

  const csv = await parseAsync(data, { fields: formattedFields });
  const filename = `${prefix}-${dayjs().format('YYYY-MM-DD')}-${dayjs().valueOf()}.csv`;
  await fs.writeFile(`/tmp/${filename}`, csv);
  const bucket = admin.storage().bucket();

  const files = await bucket.upload(`/tmp/${filename}`, {
    destination: `exports/${filename}`,
    contentType: 'text/csv',
  });

  const url = await files[0].getSignedUrl({
    action: 'read',
    expires: dayjs().add(1, 'day').format(),
  });

  return url[0];
};

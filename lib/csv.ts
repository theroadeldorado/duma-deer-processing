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

  // Cape/Hide options
  cape: 'Keep Cape',
  hide: 'Keep Hide',
  euroMount: 'Euro Mount',
  capeHideNotes: 'Cape/Hide Notes',

  // Processing options
  skinnedOrBoneless: 'Skinned/Boneless',
  skinnedBonelessNotes: 'Skinned/Boneless Notes',
  quickOption: 'Processing Option',

  // Cutting preferences
  backStrapsPreference: 'Back Straps 1 Preference',
  backStrapNotes: 'Back Straps Notes',
  hindLegPreference1: 'Hind Leg Preference 1',
  hindLegJerky1Flavor: 'Hind Leg 1 Jerky Flavor',
  hindLegPreference2: 'Hind Leg Preference 2',
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
  amountPaid: 'Amount Paid',
  totalPrice: 'Total Price',
  _id: 'ID',
};

/**
 * Fields to exclude from auto-generation (internal or already handled)
 */
const EXCLUDED_FIELDS = new Set([
  'name', // Combined into firstName/lastName
  'fullAddress', // Split into address/city/state/zip
  'specialtyMeats', // Not a direct field
  'hasPrinted', // Internal field
  'historicalItemPrices', // Internal pricing data
  'pricingSnapshot', // Internal pricing data
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

export const exportDeers = async (data: DeerT[]) => {
  const fields = getCsvFields();

  const formattedData = data.map((data) => {
    return {
      ...data,
      createdAt: dayjs(data.createdAt).format('MM/DD/YYYY'),
    };
  });

  return saveCSV('Deers', fields, formattedData);
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

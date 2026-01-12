import { DeerT, DeerSchemaT } from 'lib/types';
import mongoose from 'mongoose';
import { generateMongooseFieldsFromConfig } from '@/lib/schemaHelpers';

const { Schema, model, models } = mongoose;

/**
 * Manual Mongoose field definitions for fields NOT in productsConfig
 * or requiring special schema configuration beyond what can be auto-generated.
 *
 * WHEN TO ADD HERE:
 * - System fields (_id with required: true)
 * - Fields with special Mongoose types (Map, Mixed)
 * - Fields not defined in productsConfig
 * - Fields requiring specific Mongoose options (indexes, etc.)
 *
 * WHEN NOT TO ADD HERE:
 * - Simple string fields that exist in productsConfig
 * - Specialty meat fields (auto-generated from productsConfig.specialtyMeats)
 * - Notes fields (auto-generated from productsConfig)
 */
const manualMongooseFields: Partial<DeerSchemaT> = {
  // System fields
  _id: {
    type: String,
    required: true,
  },

  // Contact fields that need required flag (override auto-generated)
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  stateHarvestedIn: {
    type: String,
  },

  // Date fields
  dateHarvested: {
    type: String,
  },
  dateFound: {
    type: String,
  },

  // Numeric fields
  deposit: {
    type: Number,
  },
  capeHideDeposit: {
    type: Number,
  },
  capeHideTotal: {
    type: Number,
  },
  approxNeckMeasurement: {
    type: Number,
  },
  amountPaid: {
    type: Number,
  },
  totalPrice: {
    type: Number,
  },

  // Historical pricing (special Map types)
  historicalItemPrices: {
    type: Map,
    of: Number,
  },
  pricingSnapshot: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },

  // Shoulder mount fields
  shoulderMountHeadPosition: {
    type: String,
  },
  shoulderMountEarPosition: {
    type: String,
  },
  shoulderMountSpecialInstructions: {
    type: String,
  },
  hideCondition: {
    type: String,
  },
  facialFeatures: {
    type: String,
  },

  // Cape/rack tracking fields
  rackId: {
    type: String,
  },
  capeId: {
    type: String,
  },
  capeMorseCode: {
    type: String,
  },
  formOrdered: {
    type: String,
  },
  hasPrinted: {
    type: String,
  },

  // Second back strap field (not in productsConfig)
  backStrap2Preference: {
    type: String,
  },

  // Hind leg jerky fields
  hindLegJerky1: {
    type: String,
  },
  hindLegJerky2: {
    type: String,
  },

  // Recap notes
  recapNotes: {
    type: String,
  },
};

// Generate fields from productsConfig and merge with manual fields
// Manual fields take precedence (are spread last) to allow overrides
const generatedFields = generateMongooseFieldsFromConfig();

const fields: DeerSchemaT = {
  ...generatedFields,
  ...manualMongooseFields,
} as DeerSchemaT;

const DeerSchema = new Schema(fields, {
  timestamps: true,
});

// Delete the model from mongoose.models if it exists to prevent the cached version from being used
if (models.Deer) {
  delete mongoose.models.Deer;
}

const Deer = model('Deer', DeerSchema);

// Use a more generic type assertion for compatibility
export default Deer as any;

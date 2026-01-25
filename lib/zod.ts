import { z, Schema } from 'zod';
import { EmailTemplateSchemaT, ProfileSchemaT } from '@/lib/types';
import { generateZodFieldsFromConfig } from '@/lib/schemaHelpers';

export const safeData = async <ResultType>(zodSchema: Schema, data: any) => {
  const safeInput = zodSchema.safeParse(data);
  if (!safeInput.success) throw safeInput.error.message;
  return safeInput.data as ResultType;
};

export const Profile: Omit<ProfileSchemaT, 'inviteCode' | 'uid'> = {
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'This field is required'),
  role: z.string().min(1, 'This field is required'),
};

export const ProfileZ = z.object(Profile);

const EmailTemplate: Omit<EmailTemplateSchemaT, 'key' | 'vars'> = {
  name: z.string(),
  description: z.string().optional(),
  subject: z.string(),
  body: z.string(),
};
export const EmailTemplateZ = z.object(EmailTemplate);

/**
 * Manual Zod field definitions for fields NOT in productsConfig
 * or requiring special validation beyond what can be auto-generated.
 *
 * WHEN TO ADD HERE:
 * - System fields (_id, createdAt, updatedAt)
 * - Fields with complex validation (historicalItemPrices, pricingSnapshot)
 * - Fields not defined in productsConfig
 *
 * WHEN NOT TO ADD HERE:
 * - Simple string/number fields that exist in productsConfig
 * - Specialty meat fields (auto-generated from productsConfig.specialtyMeats)
 * - Notes fields (auto-generated from productsConfig)
 */
const manualZodFields = {
  // System fields
  _id: z.string().optional(),

  // Contact fields with specific validation (override auto-generated)
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address: z.string().min(1, 'Address is required').refine(
    (val) => !val.includes('@'),
    'Please enter your home address, not your email address'
  ),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'ZIP code is required'),
  stateHarvestedIn: z.string().min(1, 'State Harvested In is required'),

  // Date fields
  dateHarvested: z.string().optional(),
  dateFound: z.string().optional(),

  // Pricing/payment fields with number transformation
  deposit: z.union([z.number(), z.string().transform((val) => (val === '' ? undefined : Number(val)))]).optional(),
  capeHideDeposit: z.union([z.number(), z.string().transform((val) => (val === '' ? undefined : Number(val)))]).optional(),
  capeHideTotal: z.union([z.number(), z.string().transform((val) => (val === '' ? undefined : Number(val)))]).optional(),
  approxNeckMeasurement: z.union([z.number(), z.string().transform((val) => (val === '' ? undefined : Number(val)))]).optional(),
  amountPaid: z.union([z.number(), z.string().transform((val) => (val === '' ? undefined : Number(val)))]).optional(),
  totalPrice: z.any().optional(),

  // Historical pricing (complex types)
  historicalItemPrices: z.record(z.string(), z.number()).optional(),
  pricingSnapshot: z.record(z.string(), z.any()).optional(),

  // Shoulder mount fields
  shoulderMountHeadPosition: z.string().optional(),
  shoulderMountEarPosition: z.string().optional(),
  shoulderMountSpecialInstructions: z.string().optional(),
  hideCondition: z.string().optional(),
  facialFeatures: z.string().optional(),

  // Cape/rack tracking fields
  rackId: z.string().optional(),
  capeId: z.string().optional(),
  capeMorseCode: z.string().optional(),
  formOrdered: z.string().optional(),
  hasPrinted: z.string().optional(),

  // Second back strap field (not in productsConfig)
  backStrap2Preference: z.string().optional(),

  // Hind leg jerky boolean fields
  hindLegJerky1: z.string().optional(),
  hindLegJerky2: z.string().optional(),

  // Recap notes
  recapNotes: z.string().optional(),
};

// Generate fields from productsConfig and merge with manual fields
// Manual fields take precedence (are spread last) to allow overrides
const generatedFields = generateZodFieldsFromConfig();

export const Deer = {
  ...generatedFields,
  ...manualZodFields,
};

export const DeerZ = z.object(Deer);

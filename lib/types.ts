import { RoleType, EmailVar } from '@/lib/enums';

export type KeyValueT = {
  [key: string]: any;
};

export type ProfileT = {
  _id: string;
  uid: string;
  email: string;
  name: string;
  role: RoleType;
  inviteCode: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * DeerT - Main deer order type
 *
 * IMPORTANT: This type uses an index signature [key: string]: any to allow
 * dynamic fields from productsConfig without requiring manual type updates.
 *
 * ADDING A NEW FIELD:
 * - For fields defined in productsConfig: No changes needed here!
 *   The index signature allows any field, and runtime validation is handled by Zod.
 *
 * - For system/special fields: Add them explicitly below for IDE autocomplete.
 *
 * The explicit fields below provide:
 * 1. IDE autocomplete for commonly-used fields
 * 2. Type checking for required fields
 * 3. Documentation of the expected shape
 *
 * Runtime validation is handled by:
 * - lib/zod.ts (via generateZodFieldsFromConfig)
 * - models/Deer.ts (via generateMongooseFieldsFromConfig)
 */
export type DeerT = {
  // Index signature allows dynamic fields from productsConfig
  [key: string]: any;

  // ===== System Fields =====
  _id?: string;
  createdAt: Date;
  updatedAt: Date;

  // ===== Contact Information =====
  // These are explicit for IDE support; also defined in productsConfig
  name: string;
  firstName: string;
  lastName: string;
  tagNumber: string;
  fullAddress: string;
  address: string;
  city: string;
  state: string;
  zip: number;
  phone: string;
  communication: string;
  stateHarvestedIn: string;
  buckOrDoe: string;
  dateHarvested?: string;
  dateFound?: string;

  // ===== Print Status =====
  hasPrinted: string;

  // ===== Cape/Hide/Mount Options =====
  // These come from productsConfig but are explicit for autocomplete
  cape?: boolean | string | number;
  hide?: boolean | string | number;
  euroMount?: string;
  capeHideNotes?: string;

  // ===== Shoulder Mount Details =====
  shoulderMountHeadPosition?: string;
  shoulderMountEarPosition?: string;
  shoulderMountSpecialInstructions?: string;
  hideCondition?: string;
  facialFeatures?: string;
  rackId?: string;
  capeId?: string;
  capeMorseCode?: string;
  approxNeckMeasurement?: number;
  formOrdered?: string;

  // ===== Pricing Fields =====
  deposit?: number;
  capeHideDeposit?: number;
  capeHideTotal?: number;
  amountPaid: number;
  totalPrice: number;

  // Historical pricing (stored at entry time to preserve prices)
  historicalItemPrices?: Record<string, number>;
  // Complete pricing configuration snapshot (entire pricing structure at entry time)
  pricingSnapshot?: Record<string, any>;

  // ===== Processing Options =====
  // These come from productsConfig but are explicit for autocomplete
  skinnedOrBoneless?: string;
  skinnedBonelessNotes?: string;
  quickOption?: string;

  // ===== Cutting Preferences =====
  backStrapsPreference?: string;
  backStrap2Preference?: string;
  backStrapNotes?: string;
  hindLegPreference1?: string;
  hindLegPreference2?: string;
  hindLegNotes?: string;
  tenderizedCubedSteaks?: boolean | string | number;
  hindLegJerky1?: boolean;
  hindLegJerky2?: boolean;
  hindLegJerky1Flavor?: string;
  hindLegJerky2Flavor?: string;
  roast?: string;
  roastNotes?: string;

  // ===== Ground Venison =====
  groundVenison?: string;
  groundVenisonAmount?: string;
  groundVenisonNotes?: string;

  // ===== Specialty Meats =====
  // NOTE: These fields are auto-generated in Zod and Mongoose schemas
  // from productsConfig.specialtyMeats. They're listed here for IDE support.
  // When adding a new specialty meat to productsConfig, you do NOT need to add it here.
  trailBolognaRegular?: number | string;
  trailBolognaCheddarCheese?: number | string;
  trailBolognaHotPepperJackCheese?: number | string;
  smokedJalapenoCheddarBrats?: number | string;
  trailBolognaNotes?: string;
  garlicRingBologna?: number | string;
  garlicRingBolognaNotes?: string;
  summerSausageMild?: number | string;
  summerSausageHot?: number | string;
  summerSausageNotes?: string;
  smokedKielbasaSausage?: number | string;
  smokedKielbasaSausageNotes?: string;
  italianSausageLinksMild?: number | string;
  italianSausageLinksHot?: number | string;
  italianSausageLinksNotes?: string;
  countryBreakfastSausage?: number | string;
  countryBreakfastSausageNotes?: string;
  babyLinksCountry?: number | string;
  babyLinksMaple?: number | string;
  babyLinksNotes?: string;
  snackSticksRegular?: number | string;
  snackSticksCheddarCheese?: number | string;
  snackSticksHotPepperJackCheese?: number | string;
  snackSticksHotHotPepperJackCheese?: number | string;
  snackSticksHoneyBBQ?: number | string;
  snackSticksNotes?: string;
  hotDogsRegular?: number | string;
  hotDogsCheddarCheese?: number | string;
  hotDogsHotPepperJackCheese?: number | string;
  hotDogsNotes?: string;
  jerkyRestructuredHot?: number | string;
  jerkyRestructuredMild?: number | string;
  jerkyRestructuredTeriyaki?: number | string;
  jerkyRestructuredNotes?: string;

  // ===== Recap =====
  recapNotes?: string;
};

export type DeerInputT = Omit<DeerT, '_id' | 'createdAt' | 'updatedAt'>;

export type ProfileInputT = Omit<ProfileT, '_id' | 'uid' | 'createdAt' | 'updatedAt' | 'inviteCode'>;
export type ProfileSchemaT = Record<keyof Omit<ProfileT, '_id' | 'updatedAt' | 'createdAt'>, any>;
export type DeerSchemaT = Record<keyof Omit<DeerT, 'updatedAt' | 'createdAt'>, any>;

export type SessionDataT = {
  name?: string;
  email?: string;
  uid?: string;
  profileId?: string;
  role?: RoleType;
  isAdmin: boolean;
};

export type FileT = {
  filename: string;
  ext?: string;
  path: string;
  url: string;
  size: number;
};

export type EmailTemplateT = {
  _id: string;
  key: string;
  name: string;
  description?: string;
  subject: string;
  body: string;
  vars: EmailVar[];
};

export type EmailTemplateInputT = Omit<EmailTemplateT, '_id' | 'createdAt' | 'updatedAt' | 'key' | 'description' | 'vars'>;
export type EmailTemplateSchemaT = Record<keyof Omit<EmailTemplateT, '_id' | 'createdAt' | 'updatedAt'>, any>;

// ===== Quick Reorder Types =====

/**
 * Customer summary returned from phone lookup
 */
export type CustomerSummary = {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  fullAddress: string;
  lastOrderId: string;
  lastOrderDate: string;
  communication?: string;
};

/**
 * Sections that can be edited in the quick reorder flow
 */
export type EditableSection =
  | 'processing-type'
  | 'cape-hide'
  | 'cutting-preferences'
  | 'ground-venison'
  | 'specialty-meats';

/**
 * Flow mode for the homepage
 */
export type QuickReorderMode =
  | 'slideshow'
  | 'customer-selection'
  | 'quick-reorder'
  | 'new-customer';

/**
 * State for the quick reorder flow
 */
export type QuickReorderState = {
  mode: QuickReorderMode;
  selectedCustomer: CustomerSummary | null;
  previousOrder: Partial<DeerT> | null;
  editingSection: EditableSection | null;
};

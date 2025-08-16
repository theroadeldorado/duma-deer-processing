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

export type DeerT = {
  [key: string]: any;
  _id?: string;
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
  hasPrinted: string;
  buckOrDoe: string;
  dateHarvested?: string;
  dateFound?: string;
  cape?: boolean | string | number;
  hide?: boolean | string | number;
  euroMount?: string;
  shoulderMountHeadPosition?: string;
  shoulderMountEarPosition?: string;
  shoulderMountMouthPosition?: string;
  shoulderMountEyeExpression?: string;
  shoulderMountSpecialInstructions?: string;
  capeHideNotes?: string;
  skinnedOrBoneless?: string;
  skinnedBonelessNotes?: string;
  quickOption?: string;
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
  groundVenison?: string;
  groundVenisonAmount?: string;
  groundVenisonNotes?: string;
  trailBolognaRegular?: number | string;
  trailBolognaCheddarCheese?: number | string;
  trailBolognaHotPepperJackCheese?: number | string;
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
  recapNotes?: string;
  amountPaid: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
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

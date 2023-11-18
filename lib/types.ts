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
  _id: string;
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
  cape?: boolean;
  hide?: boolean;
  euroMount?: boolean;
  capeHideNotes?: string;
  skinnedOrBoneless?: string;
  skinnedBonelessNotes?: string;
  backStrapsPreference?: string;
  backStrap2Preference?: string;
  backStrapNotes?: string;
  hindLegPreference1?: string;
  hindLegPreference2?: string;
  hindLegNotes?: string;
  tenderizedCubedSteaks?: boolean;
  hindLegJerky1?: boolean;
  hindLegJerky2?: boolean;
  roast?: string;
  roastNotes?: string;
  groundVenison?: string;
  groundVenisonNotes?: string;
  trailBolognaRegular?: number;
  trailBolognaCheddarCheese?: number;
  trailBolognaHotPepperJackCheese?: number;
  trailBolognaNotes?: string;
  garlicRingBologna?: number;
  garlicRingBolognaNotes?: string;
  summerSausageMild?: number;
  summerSausageHot?: number;
  summerSausageNotes?: string;
  smokedKielbasaSausage?: number;
  smokedKielbasaSausageNotes?: string;
  italianSausageLinksMild?: number;
  italianSausageLinksHot?: number;
  italianSausageLinksNotes?: string;
  countryBreakfastSausage?: number;
  countryBreakfastSausageNotes?: string;
  babyLinksCountry?: number;
  babyLinksMaple?: number;
  babyLinksNotes?: string;
  snackSticksRegular?: number;
  snackSticksCheddarCheese?: number;
  snackSticksHotPepperJackCheese?: number;
  snackSticksHotHotPepperJackCheese?: number;
  snackSticksHoneyBbq?: number;
  snackSticksNotes?: string;
  hotDogsRegular?: number;
  hotDogsCheddarCheese?: number;
  hotDogsHotPepperJackCheese?: number;
  hotDogsNotes?: string;
  jerkyRestructuredHot?: number;
  jerkyRestructuredMild?: number;
  jerkyRestructuredTeriyaki?: number;
  jerkyRestructuredNotes?: string;
  recapNotes?: string;
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

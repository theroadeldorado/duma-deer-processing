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
  tagNumber: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  communicationPreference: string;
  cape?: string;
  hide?: string;
  capeHideNotes?: string;
  isSkinned?: string;
  skinnedBonelessNotes?: string;
  backStraps1Preference?: string;
  backStrap2Preference?: string;
  backStrapNotes?: string;
  hindLegPreference1?: string;
  hindLegPreference2?: string;
  hindLegNotes?: string;
  tenderizedCubedSteaks?: string;
  hindLegJerky1?: string;
  hindLegJerky2?: string;
  roast?: string;
  roastNotes?: string;
  groundVenisonBeefTrim?: string;
  groundVenisonPorkTrim?: string;
  groundVenisonNotes?: string;
  trailBolognaRegular?: string;
  trailBolognaCheddarCheese?: string;
  trailBolognaHotPepperJackCheese?: string;
  trailBolognaNotes?: string;
  garlicRingBologna?: string;
  garlicRingBolognaNotes?: string;
  summerSausageMild?: string;
  summerSausageHot?: string;
  summerSausageNotes?: string;
  smokedKielbasaSausage?: string;
  smokedKielbasaSausageNotes?: string;
  italianSausageLinksMild?: string;
  italianSausageLinksHot?: string;
  italianSausageLinksNotes?: string;
  countryBreakfastSausage?: string;
  countryBreakfastSausageNotes?: string;
  babyLinksCountry?: string;
  babyLinksMaple?: string;
  babyLinksNotes?: string;
  snackSticksRegular?: string;
  snackSticksCheddarCheese?: string;
  snackSticksHotPepperJackCheese?: string;
  snackSticksHotHotPepperJackCheese?: string;
  snackSticksHoneyBbq?: string;
  snackSticksNotes?: string;
  hotDogsRegular?: string;
  hotDogsCheddarCheese?: string;
  hotDogsHotPepperJackCheese?: string;
  hotDogsNotes?: string;
  jerkyRestructuredHot?: string;
  jerkyRestructuredMild?: string;
  jerkyRestructuredTeriyaki?: string;
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

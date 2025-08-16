import { z, Schema } from 'zod';
import { EmailTemplateSchemaT, ProfileSchemaT } from '@/lib/types';

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

export const Deer = {
  _id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  firstName: z.string().min(1, 'Name is required'),
  lastName: z.string().min(1, 'Name is required'),
  tagNumber: z.string().min(1, 'Confirmation Number is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'ZIP code is required'),
  phone: z.string().min(1, 'Phone number is required'),
  communication: z.string().min(1, 'Communication is required'),
  stateHarvestedIn: z.string().min(1, 'State Harvested In is required'),
  buckOrDoe: z.string().min(1, 'Deer Type is required'),
  dateHarvested: z.string().optional(),
  dateFound: z.string().optional(),
  cape: z.string().optional(),
  hide: z.string().optional(),
  euroMount: z.string().optional(),
  shoulderMountHeadPosition: z.string().optional(),
  shoulderMountEarPosition: z.string().optional(),
  shoulderMountMouthPosition: z.string().optional(),
  shoulderMountEyeExpression: z.string().optional(),
  shoulderMountSpecialInstructions: z.string().optional(),
  hasPrinted: z.string().optional(),
  capeHideNotes: z.string().optional(),
  skinnedOrBoneless: z.string().optional(),
  skinnedBonelessNotes: z.string().optional(),
  quickOption: z.string().optional(),
  backStrapsPreference: z.string().optional(),
  backStrap2Preference: z.string().optional(),
  backStrapNotes: z.string().optional(),
  hindLegPreference1: z.string().optional(),
  hindLegPreference2: z.string().optional(),
  hindLegNotes: z.string().optional(),
  tenderizedCubedSteaks: z.string().optional(),
  hindLegJerky1: z.string().optional(),
  hindLegJerky2: z.string().optional(),
  hindLegJerky1Flavor: z.string().optional(),
  hindLegJerky2Flavor: z.string().optional(),
  roast: z.string().optional(),
  roastNotes: z.string().optional(),
  groundVenison: z.string().optional(),
  groundVenisonAmount: z.string().optional(),
  groundVenisonNotes: z.string().optional(),
  trailBolognaRegular: z.any().optional(),
  trailBolognaCheddarCheese: z.any().optional(),
  trailBolognaHotPepperJackCheese: z.any().optional(),
  trailBolognaNotes: z.string().optional(),
  garlicRingBologna: z.string().optional(),
  garlicRingBolognaNotes: z.string().optional(),
  summerSausageMild: z.string().optional(),
  summerSausageHot: z.string().optional(),
  summerSausageNotes: z.string().optional(),
  smokedKielbasaSausage: z.string().optional(),
  smokedKielbasaSausageNotes: z.string().optional(),
  italianSausageLinksMild: z.string().optional(),
  italianSausageLinksHot: z.string().optional(),
  italianSausageLinksNotes: z.string().optional(),
  countryBreakfastSausage: z.string().optional(),
  countryBreakfastSausageNotes: z.string().optional(),
  babyLinksCountry: z.string().optional(),
  babyLinksMaple: z.string().optional(),
  babyLinksNotes: z.string().optional(),
  snackSticksRegular: z.string().optional(),
  snackSticksCheddarCheese: z.string().optional(),
  snackSticksHotPepperJackCheese: z.string().optional(),
  snackSticksHotHotPepperJackCheese: z.string().optional(),
  snackSticksHoneyBBQ: z.string().optional(),
  snackSticksNotes: z.string().optional(),
  hotDogsRegular: z.string().optional(),
  hotDogsCheddarCheese: z.string().optional(),
  hotDogsHotPepperJackCheese: z.string().optional(),
  hotDogsNotes: z.string().optional(),
  jerkyRestructuredHot: z.string().optional(),
  jerkyRestructuredMild: z.string().optional(),
  jerkyRestructuredTeriyaki: z.string().optional(),
  jerkyRestructuredNotes: z.string().optional(),
  recapNotes: z.string().optional(),
  amountPaid: z.any().optional(),
  totalPrice: z.any().optional(),
};

export const DeerZ = z.object(Deer);

import { DeerT, DeerSchemaT } from 'lib/types';
import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const fields: DeerSchemaT = {
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  hasPrinted: {
    type: String,
  },
  lastName: {
    type: String,
  },
  tagNumber: {
    type: String,
    required: true,
  },
  stateHarvestedIn: {
    type: String,
  },
  buckOrDoe: {
    type: String,
  },
  fullAddress: {
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
  phone: {
    type: String,
    required: true,
  },
  communication: {
    type: String,
    required: true,
  },
  cape: {
    type: String,
  },
  hide: {
    type: String,
  },
  capeHideNotes: {
    type: String,
  },
  skinnedOrBoneless: {
    type: String,
  },
  euroMount: {
    type: String,
  },
  shoulderMountHeadPosition: {
    type: String,
  },
  shoulderMountEarPosition: {
    type: String,
  },
  shoulderMountSpecialInstructions: {
    type: String,
  },
  skinnedBonelessNotes: {
    type: String,
  },
  quickOption: {
    type: String,
  },
  backStrapsPreference: {
    type: String,
  },
  backStrap2Preference: {
    type: String,
  },
  backStrapNotes: {
    type: String,
  },
  hindLegPreference1: {
    type: String,
  },
  hindLegPreference2: {
    type: String,
  },
  hindLegNotes: {
    type: String,
  },
  tenderizedCubedSteaks: {
    type: String,
  },
  hindLegJerky1: {
    type: String,
  },
  hindLegJerky2: {
    type: String,
  },
  hindLegJerky1Flavor: {
    type: String,
  },
  hindLegJerky2Flavor: {
    type: String,
  },
  roast: {
    type: String,
  },
  roastNotes: {
    type: String,
  },
  groundVenison: {
    type: String,
  },
  groundVenisonAmount: {
    type: String,
  },
  groundVenisonNotes: {
    type: String,
  },
  trailBolognaRegular: {
    type: String,
  },
  trailBolognaCheddarCheese: {
    type: String,
  },
  trailBolognaHotPepperJackCheese: {
    type: String,
  },
  trailBolognaNotes: {
    type: String,
  },
  garlicRingBologna: {
    type: String,
  },
  garlicRingBolognaNotes: {
    type: String,
  },
  summerSausageMild: {
    type: String,
  },
  summerSausageHot: {
    type: String,
  },
  summerSausageNotes: {
    type: String,
  },
  smokedKielbasaSausage: {
    type: String,
  },
  smokedKielbasaSausageNotes: {
    type: String,
  },
  italianSausageLinksMild: {
    type: String,
  },
  italianSausageLinksHot: {
    type: String,
  },
  italianSausageLinksNotes: {
    type: String,
  },
  countryBreakfastSausage: {
    type: String,
  },
  countryBreakfastSausageNotes: {
    type: String,
  },
  babyLinksCountry: {
    type: String,
  },
  babyLinksMaple: {
    type: String,
  },
  babyLinksNotes: {
    type: String,
  },
  snackSticksRegular: {
    type: String,
  },
  snackSticksCheddarCheese: {
    type: String,
  },
  snackSticksHotPepperJackCheese: {
    type: String,
  },
  snackSticksHotHotPepperJackCheese: {
    type: String,
  },
  snackSticksHoneyBBQ: {
    type: String,
  },
  snackSticksNotes: {
    type: String,
  },
  hotDogsRegular: {
    type: String,
  },
  hotDogsCheddarCheese: {
    type: String,
  },
  hotDogsHotPepperJackCheese: {
    type: String,
  },
  hotDogsNotes: {
    type: String,
  },
  jerkyRestructuredHot: {
    type: String,
  },
  jerkyRestructuredMild: {
    type: String,
  },
  jerkyRestructuredTeriyaki: {
    type: String,
  },
  jerkyRestructuredNotes: {
    type: String,
  },
  amountPaid: {
    type: Number,
  },
  totalPrice: {
    type: Number,
  },
  recapNotes: {
    type: String,
  },
};

const DeerSchema = new Schema(fields, {
  timestamps: true,
});

const Deer = models?.Deer || model('Deer', DeerSchema);

export default Deer as mongoose.Model<DeerT>;

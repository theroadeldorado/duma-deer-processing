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
    type: Number || String,
    required: true,
  },
  communication: {
    type: String,
    required: true,
  },
  cape: {
    type: String || Boolean,
  },
  hide: {
    type: String || Boolean,
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
  skinnedBonelessNotes: {
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
  roast: {
    type: String,
  },
  roastNotes: {
    type: String,
  },
  groundVenison: {
    type: String,
  },
  groundVenisonNotes: {
    type: String,
  },
  trailBolognaRegular: {
    type: Number,
  },
  trailBolognaCheddarCheese: {
    type: Number,
  },
  trailBolognaHotPepperJackCheese: {
    type: Number,
  },
  trailBolognaNotes: {
    type: String,
  },
  garlicRingBologna: {
    type: Number,
  },
  garlicRingBolognaNotes: {
    type: String,
  },
  summerSausageMild: {
    type: Number,
  },
  summerSausageHot: {
    type: Number,
  },
  summerSausageNotes: {
    type: String,
  },
  smokedKielbasaSausage: {
    type: Number,
  },
  smokedKielbasaSausageNotes: {
    type: String,
  },
  italianSausageLinksMild: {
    type: Number,
  },
  italianSausageLinksHot: {
    type: Number,
  },
  italianSausageLinksNotes: {
    type: String,
  },
  countryBreakfastSausage: {
    type: Number,
  },
  countryBreakfastSausageNotes: {
    type: String,
  },
  babyLinksCountry: {
    type: Number,
  },
  babyLinksMaple: {
    type: Number,
  },
  babyLinksNotes: {
    type: String,
  },
  snackSticksRegular: {
    type: Number,
  },
  snackSticksCheddarCheese: {
    type: Number,
  },
  snackSticksHotPepperJackCheese: {
    type: Number,
  },
  snackSticksHotHotPepperJackCheese: {
    type: Number,
  },
  snackSticksHoneyBbq: {
    type: Number,
  },
  snackSticksNotes: {
    type: String,
  },
  hotDogsRegular: {
    type: Number,
  },
  hotDogsCheddarCheese: {
    type: Number,
  },
  hotDogsHotPepperJackCheese: {
    type: Number,
  },
  hotDogsNotes: {
    type: String,
  },
  jerkyRestructuredHot: {
    type: Number,
  },
  jerkyRestructuredMild: {
    type: Number,
  },
  jerkyRestructuredTeriyaki: {
    type: Number,
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

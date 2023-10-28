import { DeerDropOffT, DeerDropOffSchemaT } from 'lib/types';
import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const fields: DeerDropOffSchemaT = {
  name: {
    type: String,
    required: true,
  },
  tagNumber: {
    type: String,
    required: true,
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
  communicationPreference: {
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
  isSkinned: {
    type: String,
  },
  skinnedBonelessNotes: {
    type: String,
  },
  backStraps1Preference: {
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
  hindLegJerky2: {
    type: String,
  },
  roast: {
    type: String,
  },
  roastNotes: {
    type: String,
  },
  groundVenisonBeefTrim: {
    type: String,
  },
  groundVenisonPorkTrim: {
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
  snackSticksHoneyBbq: {
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
  recapNotes: {
    type: String,
  },
};

const DeerDropOffSchema = new Schema(fields, {
  timestamps: true,
});

const DeerDropOff = models?.DeerDropOff || model('DeerDropOff', DeerDropOffSchema);

export default DeerDropOff as mongoose.Model<DeerDropOffT>;

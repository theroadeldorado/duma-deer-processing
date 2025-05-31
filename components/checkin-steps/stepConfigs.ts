import { StepConfig } from './types';
import CustomerInfo from './CustomerInfo';
import DeerInfo from './DeerInfo';
import ProcessingType from './ProcessingType';
import CapeHideOptions from './CapeHideOptions';
import QuickOptions from './QuickOptions';
import BackStraps from './BackStraps';
import HindLegs from './HindLegs';
import Roasts from './Roasts';
import GroundVenison from './GroundVenison';
import SpecialtyMeats from './SpecialtyMeats';
import Summary from './Summary';

// Note: Steps 2-6 would be created following the same pattern
// For demonstration, I'm showing the configuration structure

export const stepConfigs: StepConfig[] = [
  {
    id: 1,
    title: 'Customer Information',
    component: CustomerInfo,
    validationFields: ['firstName', 'lastName', 'phone', 'communication', 'address', 'city', 'state', 'zip'],
  },
  {
    id: 2,
    title: 'Deer Information',
    component: DeerInfo,
    validationFields: ['tagNumber', 'stateHarvestedIn', 'buckOrDoe'],
  },
  {
    id: 3,
    title: 'Processing Type',
    component: ProcessingType,
    validationFields: ['skinnedOrBoneless'],
  },
  {
    id: 4,
    title: 'Cape & Hide Options',
    component: CapeHideOptions,
    validationFields: [], // Optional fields
  },
  {
    id: 5,
    title: 'Quick Options',
    component: QuickOptions,
    validationFields: ['quickOption'],
  },
  {
    id: 6,
    title: 'Back Straps',
    component: BackStraps,
    validationFields: ['backStrapsPreference'],
  },
  {
    id: 7,
    title: 'Hind Legs',
    component: HindLegs,
    validationFields: ['hindLegPreference1', 'hindLegPreference2'],
  },
  {
    id: 8,
    title: 'Roasts',
    component: Roasts,
    validationFields: ['roast'],
  },
  {
    id: 9,
    title: 'Ground Venison',
    component: GroundVenison,
    validationFields: ['groundVenison', 'groundVenisonAmount'],
  },
  {
    id: 10,
    title: 'Specialty Meats',
    component: SpecialtyMeats,
    validationFields: [], // Most specialty meat fields are optional
  },
  {
    id: 11,
    title: 'Summary',
    component: Summary,
    validationFields: [], // No validation needed for summary
  },
];

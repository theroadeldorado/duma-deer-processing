/**
 * Test data for E2E tests
 */

export const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || 'john@skycatchfire.com',
  password: process.env.TEST_USER_PASSWORD || 'czf3php-kdu.HMW0ejt',
};

export const TEST_CUSTOMER = {
  phone: '330-687-3625',
  name: 'Matt Thomas',
  firstName: 'Matt',
};

export const TEST_DEER_INFO = {
  tagNumber: 'TEST-' + Date.now(),
  stateHarvested: 'Ohio',
  deerType: 'Buck',
  dateHarvested: new Date().toISOString().split('T')[0],
  dateFound: new Date().toISOString().split('T')[0],
};

export const TEST_NEW_CUSTOMER = {
  firstName: 'Test',
  lastName: 'Customer',
  phone: '555-123-4567',
  address: '123 Test Street',
  city: 'Test City',
  state: 'OH',
  zip: '12345',
  communication: 'Text',
};

export const PROCESSING_OPTIONS = {
  SKINNED: 'Skinned, Cut, Ground, Vacuum packed',
  BONELESS: 'Boneless',
  DONATION: 'Donation',
};

export const SPECIALTY_MEATS = {
  trailBolognaCheddar: 'Cheddar Cheese Trail Bologna',
  trailBolognaHot: 'Hot Pepper Jack Cheese Trail Bologna',
  snackSticksCheddar: 'Cheddar Cheese Snack Sticks',
  summerSausageMild: 'Mild Summer Sausage',
};

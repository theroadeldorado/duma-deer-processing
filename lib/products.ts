interface ProductOption {
  value?: string | number;
  label: string;
  price?: number;
  name?: string;
  pricePer5lb?: boolean;
}

interface Product {
  name?: string;
  section?: string;
  label: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  options?: (string | ProductOption)[];
  image?: string;
  price?: number;
}

interface SpecialtyMeat {
  name: string;
  image: string;
  options: ProductOption[];
}

interface SpecialtyMeatsConfig {
  section: string;
  meats: SpecialtyMeat[];
}

interface ProductsConfig {
  [key: string]: Product | SpecialtyMeatsConfig;
}

export const productsConfig: ProductsConfig = {
  name: { label: 'Name', type: 'text', required: true, section: 'Contact Information' },
  // firstName: { label: 'First Name', type: 'text', required: true },
  // lastName: { label: 'Last Name', type: 'text', required: true },
  fullAddress: { label: 'Address', type: 'text', required: true, section: 'Contact Information' },
  // address: { label: 'Address', type: 'text', required: true, section: 'Contact Information' },
  // city: { label: 'City', type: 'text', required: true },
  // state: { label: 'State', type: 'text', required: true, defaultValue: 'OH' },
  // zip: { label: 'Zip', type: 'text', required: true },
  phone: { label: 'Phone', type: 'tel', required: true, section: 'Contact Information' },
  communicationPreference: {
    label: 'Communication Preference',
    type: 'radio',
    required: true,
    options: ['call', 'text'],
    section: 'Contact Information',
  },
  tagNumber: { label: 'Tag Number', type: 'text', required: true, section: 'Contact Information' },
  stateHarvestedIn: {
    label: 'State Harvested In',
    type: 'select',
    required: true,
    options: ['OH', 'WV', 'PA', 'Other'],
    section: 'Contact Information',
  },

  // Processing Options
  skinnedOrBoneless: {
    section: 'Cutting Instructions',
    label: 'Skinned or Boneless',
    type: 'select',
    required: true,
    options: [
      { value: 'skinned', label: 'Skinned, Cut, Ground, Vacuum packed', price: 95 },
      { value: 'boneless', label: 'Boneless, 100% deboned already' },
    ],
    defaultValue: 'skinned',
  },
  cape: {
    section: 'Cutting Instructions',
    label: 'Cape for shoulder mount',
    type: 'checkbox',
    options: [{ value: 'Cape for shoulder mount', label: 'Additional', price: 50 }],
  },
  hide: {
    section: 'Cutting Instructions',
    label: 'Keep skinned hide',
    type: 'checkbox',
    options: [{ value: 'Keep skinned hide', label: 'Additional', price: 15 }],
  },
  euroMount: {
    section: 'Cutting Instructions',
    label: 'Euro Mount',
    type: 'select',
    options: [
      { value: 'none', label: 'Select Option' },
      { value: 'Keep head', label: 'Keep Head' },
      { value: 'Boiled Finished Mount', label: 'Boiled Finished Mount', price: 145 },
      { value: 'Beetles Finished Mount', label: 'Beetles Finished Mount', price: 175 },
    ],
  },

  backStrapsPreference: {
    section: 'Cutting Instructions',
    label: 'Back Strap Preference',
    type: 'select',
    required: true,
    options: ['Cut in half', 'Sliced', 'Butterfly', 'Whole', 'Grind'],
    defaultValue: 'Cut in half',
  },
  hindLegPreference1: {
    section: 'Cutting Instructions',
    label: 'Hind Leg Preference',
    type: 'select',
    required: true,
    options: [
      { value: 'Steaks', label: 'Steaks' },
      { value: 'Smoked Whole Ham', label: 'Smoked Whole Ham', price: 40 },
      { value: 'Whole Muscle', label: 'Whole Muscle', price: 35, pricePer5lb: true },
      { value: 'Grind', label: 'Ground Venison' },
    ],
    defaultValue: 'Grind',
  },
  hindLegPreference2: {
    section: 'Cutting Instructions',
    label: 'Hind Leg Preference Two',
    type: 'select',
    required: true,
    options: [
      { value: 'Steaks', label: 'Steaks' },
      { value: 'Smoked Whole Ham', label: 'Smoked Whole Ham', price: 40 },
      { value: 'Whole Muscle', label: 'Whole Muscle', price: 35, pricePer5lb: true },
      { value: 'Grind', label: 'Ground Venison' },
    ],
    defaultValue: 'Grind',
  },
  hindLegJerky1: {
    section: 'Cutting Instructions',
    label: 'Whole Muscle Jerky One',
    type: 'select',
    options: [
      { value: 'Mild', label: 'Mild' },
      { value: 'Hot', label: 'Hot' },
      { value: 'Teriyaki', label: 'Teriyaki' },
    ],
  },
  hindLegJerky2: {
    section: 'Cutting Instructions',
    label: 'Whole Muscle Jerky Two',
    type: 'select',
    options: [
      { value: 'Mild', label: 'Mild' },
      { value: 'Hot', label: 'Hot' },
      { value: 'Teriyaki', label: 'Teriyaki' },
    ],
  },
  tenderizedCubedSteaks: {
    section: 'Cutting Instructions',
    label: 'Tenderized Cubed Steaks',
    type: 'checkbox',
    options: [{ value: 'Tenderized Cubed Steaks', label: 'Additional', price: 5 }],
  },
  roast: {
    section: 'Cutting Instructions',
    label: 'Roast Preference',
    type: 'select',
    required: true,
    options: [
      { value: '2 Roasts, Grind Rest', label: '2 Roasts, Ground Venison for the rest' },
      { value: 'As many as possible', label: 'As many as possible' },
      { value: 'Grind', label: 'Ground Venison' },
    ],
    defaultValue: 'Grind',
  },
  groundVenison: {
    section: 'Ground Venison',
    label: 'Ground Venison',
    type: 'select',
    required: true,
    options: [
      { value: 'Plain', label: 'Plain' },
      { value: 'Add Beef Trim', label: 'Add Beef Trim', price: 5 },
      { value: 'Add Pork Trim', label: 'Add Pork Trim', price: 5 },
      { value: 'Add Beef & Pork Trim', label: 'Add Beef & Pork Trim', price: 10 },
    ],
  },
  specialtyMeats: {
    section: 'Specialty Meats',
    meats: [
      {
        name: 'Trail Bologna',
        image: '/trail_bologna.jpg',
        options: [
          { name: 'trailBolognaRegular', label: 'Regular Trail Bologna', price: 15, pricePer5lb: true },
          { name: 'trailBolognaCheddarCheese', label: 'Cheddar Cheese Trail Bologna', price: 20, pricePer5lb: true },
          { name: 'trailBolognaHotPepperJackCheese', label: 'Hot Pepper Jack Cheese Trail Bologna', price: 20, pricePer5lb: true },
        ],
      },
      {
        name: 'Garlic Ring Bologna',
        image: '/garlic_ring.jpg',
        options: [{ name: 'garlicRingBologna', label: 'Garlic Ring Bologna', price: 20, pricePer5lb: true }],
      },
      {
        name: 'Summer Sausage',
        image: '/summer.jpg',
        options: [
          { name: 'summerSausageMild', label: 'Mild Summer Sausage', price: 15, pricePer5lb: true },
          { name: 'summerSausageHot', label: 'Hot Summer Sausage', price: 15, pricePer5lb: true },
        ],
      },
      {
        name: 'Smoked Kielbasa Sausage',
        image: '/smoked_kielbasa_sausage.jpg',
        options: [{ name: 'smokedKielbasaSausage', label: 'Smoked Kielbasa Sausage', price: 17.5, pricePer5lb: true }],
      },
      {
        name: 'Italian Sausage Links',
        image: '/italian_sausage_links.jpg',
        options: [
          { name: 'italianSausageLinksMild', label: 'Mild Italian Sausage Links', price: 15, pricePer5lb: true },
          { name: 'italianSausageLinksHot', label: 'Hot Italian Sausage Links', price: 15, pricePer5lb: true },
        ],
      },
      {
        name: 'Country Breakfast Sausage',
        image: '/country_breakfast_sausage.jpg',
        options: [{ name: 'countryBreakfastSausage', label: 'Country Breakfast Sausage', price: 15, pricePer5lb: true }],
      },
      {
        name: 'Baby Links',
        image: '/baby_link.jpg',
        options: [
          { name: 'babyLinksCountry', label: 'Country Baby Links', price: 20, pricePer5lb: true },
          { name: 'babyLinksMaple', label: 'Maple Baby Links', price: 20, pricePer5lb: true },
        ],
      },
      {
        name: 'Snack Sticks',
        image: '/snack_sticks.jpg',
        options: [
          { name: 'snackSticksRegular', label: 'Regular Snack Sticks', price: 25, pricePer5lb: true },
          { name: 'snackSticksCheddarCheese', label: 'Cheddar Cheese Snack Sticks', price: 30, pricePer5lb: true },
          { name: 'snackSticksHotPepperJackCheese', label: 'Hot Pepper Jack Cheese Snack Sticks', price: 30, pricePer5lb: true },
          { name: 'snackSticksHotHotPepperJackCheese', label: '🔥 Hot Hot Pepper Jack Cheese Snack Sticks', price: 30, pricePer5lb: true },
          { name: 'snackSticksHoneyBBQ', label: 'Honey BBQ Snack Sticks', price: 30, pricePer5lb: true },
        ],
      },
      {
        name: 'Hot Dogs',
        image: '/hot_dog.jpg',
        options: [
          { name: 'hotDogsRegular', label: 'Regular Hot Dogs', price: 17.5, pricePer5lb: true },
          { name: 'hotDogsCheddarCheese', label: 'Cheddar Cheese Hot Dogs', price: 22.5, pricePer5lb: true },
          { name: 'hotDogsHotPepperJackCheese', label: 'Hot Pepper Jack Cheese Hot Dogs', price: 22.5, pricePer5lb: true },
        ],
      },
      {
        name: 'Jerky Restructured',
        image: '/jerky.jpg',
        options: [
          { name: 'jerkyRestructuredHot', label: 'Hot Jerky Restructured', price: 35, pricePer5lb: true },
          { name: 'jerkyRestructuredMild', label: 'Mild Jerky Restructured', price: 35, pricePer5lb: true },
          { name: 'jerkyRestructuredTeriyaki', label: 'Teriyaki Jerky Restructured', price: 35, pricePer5lb: true },
        ],
      },
    ],
  },
};

export const getProductPrice = (productName: string, optionName: string): number => {
  const product = productsConfig.specialtyMeats as SpecialtyMeatsConfig;
  const meat = product.meats.find((m) => m.name === productName);
  if (!meat || !meat.options) return 0;

  for (const option of meat.options) {
    if (option.name === optionName) {
      return option.price ?? 0;
    }
  }
  return 0;
};

export default productsConfig;
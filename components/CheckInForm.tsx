import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from './Input';
import Form from './Form';
import RadioButtonGroup from './RadioButtonGroup';
import CheckboxGroup from './CheckboxGroup';
import Button from './Button';
import Select from './Select';
import Image from 'next/image';
import SpecialtyMeat from './SpecialtyMeat';

type CommunicationPreference = 'call' | 'text';
type BackStrapsPreference = 'Cut in half' | 'Sliced' | 'Butterfly';

type Inputs = {
  name: string;
  tagNumber: string;
  phone: string;
  communicationPreference: CommunicationPreference;
  isSkinned: boolean;
  backStrapsPreference: BackStrapsPreference;
};

const TOTAL_STEPS = 6;

const CheckInForm = () => {
  const form = useForm<Inputs>();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSkinnedSelection, setIsSkinnedSelection] = useState(null);
  const [isHindLegPreference1, setIsHindLegPreference1] = useState(null);
  const [isHindLegPreference2, setIsHindLegPreference2] = useState(null);

  const handleHindLegPreference1 = (event: any) => {
    setIsHindLegPreference1(event.target.value);
  };

  const handleHindLegPreference2 = (event: any) => {
    setIsHindLegPreference2(event.target.value);
  };

  const handleSkinned = (event: any) => {
    setIsSkinnedSelection(event.target.value);
  };

  const { register, handleSubmit, watch } = form;

  const onSubmit = (data: Inputs) => {
    console.log(data);
  };

  const progressPercentage = (currentStep / TOTAL_STEPS) * 100;

  // Watch the values of the fields based on the current step
  const values = watch();

  // Check if required fields for the current step are filled
  const isCurrentStepFilled = () => {
    switch (currentStep) {
      default:
        return true;
    }
  };

  return (
    <>
      <div className='flex flex-col gap-6'>
        <div className='relative w-full h-4 overflow-hidden rounded-full bg-tan-1'>
          <div className='absolute top-0 left-0 h-4 transition-all duration-500 bg-primary-blue' style={{ width: `${progressPercentage}%` }}></div>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)} form={form} className='flex flex-col gap-6'>
          {currentStep === 1 && (
            <>
              <Input label='Full Name' type='text' name='name' register={register} required />
              <Input label='Tag Number' type='text' name='tagNumber' register={register} required />

              <Input label='Address' type='text' name='address' register={register} required />
              <div className='grid grid-cols-5 gap-4'>
                <div className='col-span-2'>
                  <Input label='City' type='text' name='city' register={register} required />
                </div>
                <Input label='State' type='text' name='state' register={register} value='OH' required />
                <div className='col-span-2'>
                  <Input label='Zip' type='text' name='zip' register={register} required />
                </div>
              </div>
              <Input label='Phone' type='tel' name='phone' register={register} required />
              <RadioButtonGroup
                name='communicationPreference'
                required
                options={[
                  { value: 'call', label: 'Call' },
                  { value: 'text', label: 'Text' },
                ]}
                defaultCheckedValue='text'
                register={register}
                wrapperLabel='Communication Preference'
              />
            </>
          )}
          {currentStep === 2 && (
            <>
              <CheckboxGroup
                name='cape'
                options={[
                  { value: 'cape', label: 'Cape for shoulder mount. Additional $50' },
                  { value: 'hide', label: 'Keep skinned hide. Additional $50' },
                ]}
                register={register}
              />
            </>
          )}
          {currentStep === 3 && (
            <>
              <RadioButtonGroup
                name='isSkinned'
                options={[
                  { value: 'skinned', label: 'Skinned, Cut, Ground, Vacuum packed.' },
                  { value: 'boneless', label: 'Boneless, 100% deboned already.' },
                ]}
                onChange={handleSkinned}
                register={register}
                defaultCheckedValue='skinned'
                required
                wrapperLabel='Base Price - $95'
              />
              <p className='italic'>May already skinned or quartered.</p>
            </>
          )}
          {currentStep === 4 && (
            <>
              <RadioButtonGroup
                name='backStraps1Preference'
                options={[
                  { value: 'Cut in half', label: 'Cut in half' },
                  { value: 'Sliced', label: 'Sliced' },
                  { value: 'Butterfly', label: 'Butterfly' },
                  { value: 'Grind', label: 'Grind' },
                ]}
                defaultCheckedValue='Grind'
                register={register}
                wrapperLabel='Back Strap 1 Preference'
              />
              <RadioButtonGroup
                name='backStrap2Preference'
                options={[
                  { value: 'Cut in half', label: 'Cut in half' },
                  { value: 'Sliced', label: 'Sliced' },
                  { value: 'Butterfly', label: 'Butterfly' },
                  { value: 'Grind', label: 'Grind' },
                ]}
                defaultCheckedValue='Grind'
                register={register}
                wrapperLabel='Back Strap 2 Preference'
              />
            </>
          )}

          {currentStep === 5 && (
            <>
              <RadioButtonGroup
                name='hindLegPreference1'
                options={[
                  { value: 'Steaks', label: 'Steaks' },
                  { value: 'Smoked Whole Ham', label: 'Smoked Whole Ham' },
                  { value: 'Jerky', label: 'Jerky' },
                  { value: 'Grind', label: 'Grind' },
                ]}
                defaultCheckedValue='Grind'
                register={register}
                onChange={handleHindLegPreference1}
                wrapperLabel='Hind Leg Preference Leg 1'
              />
              {/* if isHindLegPreference1 === steaks */}
              {isHindLegPreference1 === 'Steaks' && (
                <CheckboxGroup
                  name='tenderizedCubedSteaks'
                  options={[{ value: 'Tenderized Cubed Steaks', label: 'Tenderized Cubed Steaks. Additional $' }]}
                  register={register}
                />
              )}
              {isHindLegPreference1 === 'Jerky' && (
                <RadioButtonGroup
                  name='hindLegJerky1'
                  options={[
                    { value: 'Hot', label: 'Hot' },
                    { value: 'Mild', label: 'Mild' },
                    { value: 'Teriyaki', label: 'Teriyaki' },
                  ]}
                  defaultCheckedValue='Mild'
                  register={register}
                  wrapperLabel='Jerky flavor'
                />
              )}

              <RadioButtonGroup
                name='hindLegPreference2'
                options={[
                  { value: 'Steaks', label: 'Steaks' },
                  { value: 'Smoked Whole Ham', label: 'Smoked Whole Ham' },
                  { value: 'Jerky', label: 'Jerky' },
                  { value: 'Grind', label: 'Grind' },
                ]}
                defaultCheckedValue='Grind'
                register={register}
                onChange={handleHindLegPreference2}
                wrapperLabel='Hind Leg Preference Leg 2'
              />
              {/* if isHindLegPreference2 === steaks */}
              {isHindLegPreference2 === 'Steaks' && (
                <CheckboxGroup
                  name='tenderizedCubedSteaks'
                  options={[{ value: 'Tenderized Cubed Steaks', label: 'Tenderized Cubed Steaks. Additional $' }]}
                  register={register}
                />
              )}
              {isHindLegPreference2 === 'Jerky' && (
                <RadioButtonGroup
                  name='hindLegJerky2'
                  options={[
                    { value: 'Hot', label: 'Hot' },
                    { value: 'Mild', label: 'Mild' },
                    { value: 'Teriyaki', label: 'Teriyaki' },
                  ]}
                  defaultCheckedValue='Mild'
                  register={register}
                  wrapperLabel='Jerky flavor'
                />
              )}
            </>
          )}

          {currentStep === 6 && (
            <>
              <RadioButtonGroup
                name='roast'
                options={[
                  { value: '2 Roasts, Grind Rest', label: '2 Roasts, Grind Rest' },
                  { value: 'As many as possible', label: 'As many as possible' },
                  { value: 'Grind', label: 'Grind' },
                ]}
                defaultCheckedValue='Grind'
                register={register}
                wrapperLabel='Roast Preference'
              />
            </>
          )}

          {currentStep === 7 && (
            <>
              <h3 className='mb-2 font-bold text-center text-display-sm'>Ground Venison Options</h3>

              <SpecialtyMeat
                name='Ground Venison'
                image='/ground_venison.jpg'
                options={[
                  { name: 'groundVenisonBeefTrim', label: 'Ground Venison with Beef Trim', price: 5 },
                  { name: 'groundVenisonPorkTrim', label: 'Ground Venison with Pork Trim', price: 5 },
                ]}
              />

              <SpecialtyMeat
                name='Trail Bologna'
                image='/trail_bologna.jpg'
                options={[
                  { name: 'trailBolognaRegular', label: 'Regular Trail Bologna', price: 5 },
                  { name: 'trailBolognaCheddarCheese', label: 'Cheddar Cheese Trail Bologna', price: 5 },
                  { name: 'trailBolognaHotPepperJackCheese', label: 'Hot Pepper Jack Cheese Trail Bologna', price: 5 },
                ]}
              />

              <SpecialtyMeat
                name='Garlic Ring Bologna'
                image='/garlic_ring_bologna.jpg'
                options={[{ name: 'garlicRingBologna', label: 'Garlic Ring Bologna', price: 5 }]}
              />

              <SpecialtyMeat
                name='Summer Sausage'
                image='/summer_sausage.jpg'
                options={[
                  { name: 'summerSausageMild', label: 'Mild Summer Sausage', price: 5 },
                  { name: 'summerSausageHot', label: 'Hot Summer Sausage', price: 5 },
                ]}
              />

              <SpecialtyMeat
                name='Smoked Kielbasa Sausage'
                image='/smoked_kielbasa_sausage.jpg'
                options={[{ name: 'smokedKielbasaSausage', label: 'Smoked Kielbasa Sausage', price: 5 }]}
              />

              <SpecialtyMeat
                name='Italian Sausage Links'
                image='/italian_sausage_links.jpg'
                options={[
                  { name: 'italianSausageLinksMild', label: 'Mild Italian Sausage Links', price: 5 },
                  { name: 'italianSausageLinksHot', label: 'Hot Italian Sausage Links', price: 5 },
                ]}
              />

              <SpecialtyMeat
                name='Country Breakfast Sausage'
                image='/country_breakfast_sausage.jpg'
                options={[{ name: 'countryBreakfastSausage', label: 'Country Breakfast Sausage', price: 5 }]}
              />

              <SpecialtyMeat
                name='Baby Links'
                image='/baby_links.jpg'
                options={[
                  { name: 'babyLinksCountry', label: 'Country Baby Links', price: 5 },
                  { name: 'babyLinksMaple', label: 'Maple Baby Links', price: 5 },
                ]}
              />

              <SpecialtyMeat
                name='Snack Sticks'
                image='/snack_sticks.jpg'
                options={[
                  { name: 'snackSticksRegular', label: 'Regular Snack Sticks', price: 5 },
                  { name: 'snackSticksCheddarCheese', label: 'Cheddar Cheese Snack Sticks', price: 5 },
                  { name: 'snackSticksHotPepperJackCheese', label: 'Hot Pepper Jack Cheese Snack Sticks', price: 5 },
                  { name: 'snackSticksHotHotPepperJackCheese', label: '🔥 Hot Hot Pepper Jack Cheese Snack Sticks', price: 5 },
                  { name: 'snackSticksHoneyBBQ', label: 'Honey BBQ Snack Sticks', price: 5 },
                ]}
              />

              <SpecialtyMeat
                name='Hot Dogs'
                image='/hot_dogs.jpg'
                options={[
                  { name: 'hotDogsRegular', label: 'Regular Hot Dogs', price: 5 },
                  { name: 'hotDogsCheddarCheese', label: 'Cheddar Cheese Hot Dogs', price: 5 },
                  { name: 'hotDogsHotPepperJackCheese', label: 'Hot Pepper Jack Cheese Hot Dogs', price: 5 },
                ]}
              />

              <SpecialtyMeat
                name='Jerky Restructured'
                image='/jerky_restructured.jpg'
                options={[
                  { name: 'jerkyRestructuredHot', label: 'Hot Jerky Restructured', price: 5 },
                  { name: 'jerkyRestructuredMild', label: 'Mild Jerky Restructured', price: 5 },
                  { name: 'jerkyRestructuredTeriyaki', label: 'Teriyaki Jerky Restructured', price: 5 },
                ]}
              />
            </>
          )}

          {currentStep === 8 && (
            <div>
              <h3 className='mb-4 text-lg font-bold'>Review Your Information:</h3>
              <ul>
                <li>
                  <span className='font-bold'>Name:</span> {values.name}
                </li>
                <li>
                  <span className='font-bold'>Tag Number:</span> {values.tagNumber}
                </li>
                <li>
                  <span className='font-bold'>Phone:</span> {values.phone}
                </li>
                <li>
                  <span className='font-bold'>Communication Preference:</span> {values.communicationPreference}
                </li>

                <li>
                  <span className='font-bold'>Cape:</span> {values.cape}
                </li>
                <li>
                  <span className='font-bold'>Hide:</span> {values.hide}
                </li>
                <li>
                  <span className='font-bold'>Skinned:</span> {values.isSkinned}
                </li>
              </ul>

              <h4 className='mt-4 mb-2 text-lg font-bold'>Selected Options:</h4>
              <ul>
                {/* Use Object.entries to iterate over all properties of the `values` object */}
                {Object.entries(values).map(([key, value]) => {
                  // Check if value is truthy or if it's an array with at least one truthy value
                  const hasValue = value && (Array.isArray(value) ? value.some((v) => v) : true);

                  return hasValue ? (
                    <li key={key}>
                      {/* Render additional option names and their $5 default price */}
                      <span className='font-bold'>{key.replace(/([A-Z])/g, ' $1')}:</span> {Array.isArray(value) ? value.join(', ') : value} - ${5}
                    </li>
                  ) : null;
                })}
              </ul>

              {/* Calculate and render the total price */}
              <p className='mt-4'>
                <span className='font-bold'>Total Price:</span> $
                {
                  // Use Object.values to get all form values, filter truthy values or non-empty arrays, and multiply their count by $5
                  Object.values(values)
                    .filter((value) => value && (Array.isArray(value) ? value.some((v) => v) : true))
                    .reduce((total, value) => total + (Array.isArray(value) ? value.length : 1) * 5, 0)
                }
              </p>
            </div>
          )}

          <div className='flex justify-between gap-4'>
            {/* Back Button */}
            {currentStep > 1 ? (
              <Button type='button' className='inline-flex gap-2' onClick={() => setCurrentStep((prevStep) => prevStep - 1)}>
                <svg xmlns='http://www.w3.org/2000/svg' height='1em' viewBox='0 0 320 512'>
                  <path
                    fill='currentColor'
                    d='M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z'
                  />
                </svg>
                Back
              </Button>
            ) : (
              <div></div>
            )}

            {/* Next Button */}
            {currentStep < 10 ? (
              <Button
                type='button'
                className='inline-flex gap-2'
                onClick={() => setCurrentStep((prevStep) => prevStep + 1)}
                disabled={!isCurrentStepFilled()}
              >
                Next
                <svg xmlns='http://www.w3.org/2000/svg' height='1em' viewBox='0 0 320 512'>
                  <path
                    fill='currentColor'
                    d='M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z'
                  />
                </svg>
              </Button>
            ) : (
              <div></div>
            )}
          </div>
        </Form>
      </div>
    </>
  );
};

export default CheckInForm;

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from './Input';
import Form from './Form';
import RadioButtonGroup from './RadioButtonGroup';
import CheckboxGroup from './CheckboxGroup';
import Button from './Button';

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
    <div className='flex flex-col gap-6'>
      <div className='relative h-4 w-full overflow-hidden rounded-full bg-gray-300'>
        <div className='absolute left-0 top-0 h-4 bg-green-500 transition-all duration-300' style={{ width: `${progressPercentage}%` }}></div>
      </div>

      <Form onSubmit={handleSubmit(onSubmit)} form={form} className='flex flex-col gap-6'>
        {currentStep === 1 && (
          <>
            <Input label='Full Name' type='text' name='name' register={register} required />
            <Input label='Tag Number' type='text' name='tagNumber' register={register} required />
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
          <RadioButtonGroup
            name='backStrapsPreference'
            options={[
              { value: 'Cut in half', label: 'Cut in half' },
              { value: 'Sliced', label: 'Sliced' },
              { value: 'Butterfly', label: 'Butterfly' },
              { value: 'Grind', label: 'Grind' },
            ]}
            defaultCheckedValue='Cut in half'
            register={register}
            wrapperLabel='Back Straps Preference'
          />
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
            <CheckboxGroup
              name='hamburgerPatties'
              options={[
                { value: 'Add Beef Trim', label: 'Add Beef Trim. $' },
                { value: 'Add Pork Trim', label: 'Add Pork Trim. $' },
              ]}
              wrapperLabel='Hamburger Patties Options'
              register={register}
            />

            <CheckboxGroup
              name='trailBologna'
              options={[
                { value: 'Regular', label: 'Regular. $' },
                { value: 'Cheddar Cheese', label: 'Cheddar Cheese. $' },
                { value: 'Hot Pepper Jack Cheese', label: 'Hot Pepper Jack Cheese. $' },
              ]}
              wrapperLabel='Trail Bologna'
              register={register}
            />

            <CheckboxGroup
              name='garlicRingBologna'
              options={[{ value: 'Regular', label: 'Regular. $' }]}
              wrapperLabel='Garlic Ring Bologna'
              register={register}
            />

            <CheckboxGroup
              name='summerSausage'
              options={[
                { value: 'Mild', label: 'Mild. $' },
                { value: 'Hot', label: 'Hot. $' },
              ]}
              wrapperLabel='Summer Sausage'
              register={register}
            />

            <CheckboxGroup
              name='smokedKielbasaSausage'
              options={[{ value: 'Regular', label: 'Regular. $' }]}
              wrapperLabel='Smoked Kielbasa Sausage'
              register={register}
            />

            <CheckboxGroup
              name='italianSausageLinks'
              options={[
                { value: 'Mild', label: 'Mild. $' },
                { value: 'Hot', label: 'Hot. $' },
              ]}
              wrapperLabel='Italian Sausage Links'
              register={register}
            />

            <CheckboxGroup
              name='countryBreakfastSausage'
              options={[{ value: 'Regular', label: 'Regular. $' }]}
              wrapperLabel='Country Breakfast Sausage'
              register={register}
            />

            <CheckboxGroup
              name='babyLinks'
              options={[
                { value: 'Country', label: 'Country. $' },
                { value: 'Maple', label: 'Maple. $' },
              ]}
              wrapperLabel='Baby Links'
              register={register}
            />

            <CheckboxGroup
              name='snackSticks'
              options={[
                { value: 'Regular', label: 'Regular. $' },
                { value: 'Cheddar Cheese', label: 'Cheddar Cheese. $' },
                { value: 'Hot Pepper Jack Cheese', label: 'Hot Pepper Jack Cheese. $' },
                { value: 'Hot Hot Pepper Jack Cheese', label: '🔥 Hot Hot Pepper Jack Cheese. $' },
                { value: 'Honey BBQ', label: 'Honey BBQ. $' },
              ]}
              wrapperLabel='Snack Sticks'
              register={register}
            />
            <CheckboxGroup
              name='hotDogs'
              options={[
                { value: 'Regular', label: 'Regular. $' },
                { value: 'Cheddar Cheese', label: 'Cheddar Cheese. $' },
                { value: 'Hot Pepper Jack Cheese', label: 'Hot Pepper Jack Cheese. $' },
              ]}
              wrapperLabel='Hot Dogs'
              register={register}
            />

            {/* Jerky  Restructured */}
            <CheckboxGroup
              name='jerkyRestructured'
              options={[
                { value: 'Hot', label: 'Hot. $' },
                { value: 'Mild', label: 'Mild. $' },
                { value: 'Teriyaki', label: 'Teriyaki. $' },
              ]}
              wrapperLabel='Jerky Restructured'
              register={register}
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
            </ul>

            <h4 className='mb-2 mt-4 text-lg font-bold'>Selected Options:</h4>
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
  );
};

export default CheckInForm;

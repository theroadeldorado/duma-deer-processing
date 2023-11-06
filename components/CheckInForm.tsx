import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Input from './Input';
import Form from './Form';
import RadioButtonGroup from './RadioButtonGroup';
import CheckboxGroup from './CheckboxGroup';
import Button from './Button';
import Image from 'next/image';
import SpecialtyMeat from './SpecialtyMeat';
import Textarea from './Textarea';
import router from 'next/router';
import useMutation from 'hooks/useMutation';
import { DeerT } from 'lib/types';

const TOTAL_STEPS = 7;

const CheckInForm = () => {
  const form = useForm<DeerT>();
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

  const progressPercentage = ((currentStep - 1) / TOTAL_STEPS) * 100;
  const { register, watch } = form;
  const values = watch();
  const isCurrentStepFilled = () => {
    switch (currentStep) {
      default:
        return true;
    }
  };

  const mutation = useMutation({
    url: '/api/auth/Deer',
    method: 'POST',
    onSuccess: async (data: any) => {
      router.push('/login');
    },
  });

  const handleSubmit: SubmitHandler<DeerT> = async ({ ...data }) => {
    data._id = `${data.tagNumber}-${Date.now()}`;
    mutation.mutate(data as any);
  };

  return (
    <>
      <div className='flex flex-col gap-6'>
        <div className='relative h-4 w-full overflow-hidden rounded-full bg-tan-1'>
          <div className='absolute left-0 top-0 h-4 bg-primary-blue transition-all duration-500' style={{ width: `${progressPercentage}%` }}></div>
        </div>

        <Form onSubmit={handleSubmit} form={form} className='flex flex-col gap-6'>
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
              <div className='grid grid-cols-2 gap-6'>
                <div className='flex flex-col gap-3'>
                  <div className='relative aspect-[3/2] w-full overflow-hidden rounded-md'>
                    <Image src={'/cape.png'} className='absolute inset-0 h-full w-full object-cover' width={500} height={300} alt={'cape'} />
                  </div>
                  <div className='pl-2'>
                    <CheckboxGroup name='cape' options={[{ value: 'cape', label: 'Cape for shoulder mount. Additional $50' }]} register={register} />
                  </div>
                </div>
                <div className='flex flex-col gap-3'>
                  <div className='relative aspect-[3/2] w-full overflow-hidden rounded-md'>
                    <Image src={'/hide.jpg'} className='absolute inset-0 h-full w-full object-cover' width={500} height={300} alt={'hide'} />
                  </div>
                  <div className='pl-2'>
                    <CheckboxGroup name='hide' options={[{ value: 'hide', label: 'Keep skinned hide. Additional $15' }]} register={register} />
                  </div>
                </div>
                <p className='col-span-2 mt-2 text-center italic'>NOT MOUNTED just the cape for a mounting. Hide and saved for you, NOT TANNED.</p>
                <div className='col-span-2'>
                  <Textarea rows={2} name={`cape-hide-Notes`} label='Special Instructions' register={register} />
                </div>
              </div>
            </>
          )}
          {currentStep === 3 && (
            <>
              <div className='grid grid-cols-1 gap-5'>
                <div className='relative aspect-[5/2] w-full overflow-hidden rounded-md'>
                  <Image src={'/deer.jpg'} className='absolute inset-0 h-full w-full object-cover' width={500} height={300} alt={'deer'} />
                </div>
                <div className='pl-2'>
                  <RadioButtonGroup
                    name='isSkinned'
                    options={[
                      { value: 'skinned', label: '$95 - Skinned, Cut, Ground, Vacuum packed.' },
                      { value: 'boneless', label: 'Boneless, 100% deboned already.' },
                    ]}
                    onChange={handleSkinned}
                    register={register}
                    defaultCheckedValue='skinned'
                    required
                  />
                  <p className='mt-2 text-center italic'>
                    Must select "Skinned" even if already skinned or quartered.
                    <br />
                    There is no cost if your deer is 100% deboned.
                  </p>
                </div>
                <div>
                  <Textarea rows={2} name={`skinned-boneless-Notes`} label='Special Instructions' register={register} />
                </div>
              </div>
            </>
          )}
          {currentStep === 4 && (
            <>
              <div className='flex flex-col items-center justify-center gap-4'>
                <div className='mb-6 aspect-square w-48 overflow-hidden rounded-full border-[5px] border-dashed border-[#E28532] bg-tan-1'>
                  <Image src={'/back_straps.svg'} className='h-full w-full scale-150 object-cover' width={500} height={300} alt={'backstraps'} />
                </div>
                <div className='grid grid-cols-2 gap-20 [&>label>div]:flex-col [&>label>div]:items-start [&>label>div]:justify-start'>
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
                </div>
                <div className='w-full'>
                  <Textarea rows={2} name={`backstrap-Notes`} label='Special Instructions' register={register} />
                </div>
              </div>
            </>
          )}

          {currentStep === 5 && (
            <>
              <div className='flex flex-col items-center justify-center gap-4'>
                <div className='mb-6 aspect-square w-48 overflow-hidden rounded-full border-[5px] border-dashed border-[#E28532] bg-tan-1'>
                  <Image
                    src={'/hind.svg'}
                    className='h-full w-full -translate-x-24 -translate-y-10 scale-[2]'
                    width={500}
                    height={300}
                    alt={'backstraps'}
                  />
                </div>
                <div className='flex flex-col items-center justify-center gap-5 text-center'>
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

                  {isHindLegPreference1 === 'Jerky' && (
                    <>
                      <div className='relative aspect-[3/1] overflow-hidden rounded-md'>
                        <Image src={'/jerky-2.jpg'} className='h-full w-full object-cover ' width={500} height={300} alt={'jerky'} />
                      </div>
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
                    </>
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

                  {isHindLegPreference2 === 'Jerky' && (
                    <>
                      <div className='relative aspect-[3/1] overflow-hidden rounded-md'>
                        <Image src={'/jerky-2.jpg'} className='h-full w-full object-cover ' width={500} height={300} alt={'jerky'} />
                      </div>
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
                    </>
                  )}

                  {(isHindLegPreference1 === 'Steaks' || isHindLegPreference2 === 'Steaks') && (
                    <CheckboxGroup
                      name='tenderizedCubedSteaks'
                      options={[{ value: 'Tenderized Cubed Steaks', label: '$5 - Tenderized Cubed Steaks.' }]}
                      register={register}
                    />
                  )}
                </div>

                <div className='w-full'>
                  <Textarea rows={2} name={`hind-leg-Notes`} label='Special Instructions' register={register} />
                </div>
              </div>
            </>
          )}

          {currentStep === 6 && (
            <>
              <div className='flex flex-col items-center justify-center gap-4'>
                <div className='mb-6 aspect-square w-48 overflow-hidden rounded-full border-[5px] border-dashed border-[#E28532] bg-tan-1'>
                  <Image
                    src={'/roast.svg'}
                    className='h-full w-full translate-x-14 translate-y-8 scale-150 object-cover'
                    width={500}
                    height={300}
                    alt={'roast'}
                  />
                </div>
                <div className='flex flex-col items-center justify-center gap-5 text-center'>
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
                </div>

                <div className='w-full'>
                  <Textarea rows={2} name={`roast-Notes`} label='Special Instructions' register={register} />
                </div>
              </div>
            </>
          )}

          {currentStep === 7 && (
            <>
              <h3 className='mb-2 text-center text-display-sm font-bold'>Ground Venison Options</h3>

              <SpecialtyMeat
                name='Ground Venison'
                image='/ground_venison.jpg'
                options={[
                  { name: 'groundVenisonBeefTrim', label: 'Ground Venison with Beef Trim', price: 5, priceFlat: true },
                  { name: 'groundVenisonPorkTrim', label: 'Ground Venison with Pork Trim', price: 5, priceFlat: true },
                ]}
              />
              <p className='text-center italic'>Ground Venison is the default option if nothing is selected.</p>

              <SpecialtyMeat
                name='Trail Bologna'
                image='/trail_bologna.jpg'
                options={[
                  { name: 'trailBolognaRegular', label: 'Regular Trail Bologna', price: 15 },
                  { name: 'trailBolognaCheddarCheese', label: 'Cheddar Cheese Trail Bologna', price: 20 },
                  { name: 'trailBolognaHotPepperJackCheese', label: 'Hot Pepper Jack Cheese Trail Bologna', price: 20 },
                ]}
              />

              <SpecialtyMeat
                name='Garlic Ring Bologna'
                image='/garlic_ring.jpg'
                options={[{ name: 'garlicRingBologna', label: 'Garlic Ring Bologna', price: 20 }]}
              />

              <SpecialtyMeat
                name='Summer Sausage'
                image='/summer.jpg'
                options={[
                  { name: 'summerSausageMild', label: 'Mild Summer Sausage', price: 15 },
                  { name: 'summerSausageHot', label: 'Hot Summer Sausage', price: 15 },
                ]}
              />

              <SpecialtyMeat
                name='Smoked Kielbasa Sausage'
                image='/smoked_kielbasa_sausage.jpg'
                options={[{ name: 'smokedKielbasaSausage', label: 'Smoked Kielbasa Sausage', price: 17.5 }]}
              />

              <SpecialtyMeat
                name='Italian Sausage Links'
                image='/italian_sausage_links.jpg'
                options={[
                  { name: 'italianSausageLinksMild', label: 'Mild Italian Sausage Links', price: 15 },
                  { name: 'italianSausageLinksHot', label: 'Hot Italian Sausage Links', price: 15 },
                ]}
              />

              <SpecialtyMeat
                name='Country Breakfast Sausage'
                image='/country_breakfast_sausage.jpg'
                options={[{ name: 'countryBreakfastSausage', label: 'Country Breakfast Sausage', price: 15 }]}
              />

              <SpecialtyMeat
                name='Baby Links'
                image='/baby_link.jpg'
                options={[
                  { name: 'babyLinksCountry', label: 'Country Baby Links', price: 20 },
                  { name: 'babyLinksMaple', label: 'Maple Baby Links', price: 20 },
                ]}
              />

              <SpecialtyMeat
                name='Snack Sticks'
                image='/snack_sticks.jpg'
                options={[
                  { name: 'snackSticksRegular', label: 'Regular Snack Sticks', price: 25 },
                  { name: 'snackSticksCheddarCheese', label: 'Cheddar Cheese Snack Sticks', price: 30 },
                  { name: 'snackSticksHotPepperJackCheese', label: 'Hot Pepper Jack Cheese Snack Sticks', price: 30 },
                  { name: 'snackSticksHotHotPepperJackCheese', label: '🔥 Hot Hot Pepper Jack Cheese Snack Sticks', price: 30 },
                  { name: 'snackSticksHoneyBBQ', label: 'Honey BBQ Snack Sticks', price: 30 },
                ]}
              />

              <SpecialtyMeat
                name='Hot Dogs'
                image='/hot_dog.jpg'
                options={[
                  { name: 'hotDogsRegular', label: 'Regular Hot Dogs', price: 17.5 },
                  { name: 'hotDogsCheddarCheese', label: 'Cheddar Cheese Hot Dogs', price: 22.5 },
                  { name: 'hotDogsHotPepperJackCheese', label: 'Hot Pepper Jack Cheese Hot Dogs', price: 22.5 },
                ]}
              />

              <SpecialtyMeat
                name='Jerky Restructured'
                image='/jerky.jpg'
                options={[
                  { name: 'jerkyRestructuredHot', label: 'Hot Jerky Restructured', price: 35 },
                  { name: 'jerkyRestructuredMild', label: 'Mild Jerky Restructured', price: 35 },
                  { name: 'jerkyRestructuredTeriyaki', label: 'Teriyaki Jerky Restructured', price: 35 },
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

              <div>
                <Textarea rows={2} name={`recap-Notes`} label='Special Instructions' register={register} />
              </div>
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
            {currentStep < 8 ? (
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
              <>
                <Button type='submit' className='inline-flex origin-right scale-150 gap-2 bg-[#E28532] ' disabled={!isCurrentStepFilled()}>
                  Submit Order
                </Button>
                <div className='[w-20]'></div>
              </>
            )}
          </div>
        </Form>
      </div>
    </>
  );
};

export default CheckInForm;

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
import Select from './Select';

const TOTAL_STEPS = 7;

const CheckInForm = () => {
  const form = useForm<DeerT>();
  const [currentStep, setCurrentStep] = useState(1);
  const [isHindLegPreference1, setIsHindLegPreference1] = useState(null);
  const [isHindLegPreference2, setIsHindLegPreference2] = useState(null);

  const handleHindLegPreference1 = (event: any) => {
    setIsHindLegPreference1(event.target.value);
  };

  const handleHindLegPreference2 = (event: any) => {
    setIsHindLegPreference2(event.target.value);
  };

  // Function to calculate total price
  const calculateTotalPrice = (values: any) => {
    return 0;
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
    url: '/api/auth/deer',
    method: 'POST',
    onSuccess: async (data: any) => {
      router.push('/success');
    },
  });

  const handleSubmit: SubmitHandler<DeerT> = async ({ ...data }) => {
    data._id = data.tagNumber + Date.now();
    data.name = data.firstName + ' ' + data.lastName;
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
              <div className='grid grid-cols-2 gap-4'>
                <Input label='First Name' type='text' name='firstName' register={register} required />
                <Input label='Last Name' type='text' name='lastName' register={register} required />
              </div>
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

              <Select
                name='stateHarvestedIn'
                label='State Harvested In'
                register={register}
                placeholder='Select State'
                required
                options={[
                  { value: 'OH', label: 'Ohio' },
                  { value: 'WV', label: 'West Virginia' },
                  { value: 'PA', label: 'Pennsylvania' },
                  { value: 'Other', label: 'Other' },
                ]}
              ></Select>

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
              <div className='grid grid-cols-3 gap-6'>
                <div className='flex flex-col items-center justify-start gap-1'>
                  <div className='relative aspect-square w-full overflow-hidden rounded-md'>
                    <Image src={'/cape.png'} className='absolute inset-0 h-full w-full object-cover' width={500} height={300} alt={'cape'} />
                  </div>
                  <p className='mb-1 w-full text-center font-bold'>Cape for shoulder mount</p>
                  <CheckboxGroup name='cape' options={[{ value: 'Cape for shoulder mount', label: 'Additional $50.' }]} register={register} />
                </div>
                <div className='flex flex-col items-center justify-start gap-1'>
                  <div className='relative aspect-square w-full overflow-hidden rounded-md'>
                    <Image src={'/hide.jpg'} className='absolute inset-0 h-full w-full object-cover' width={500} height={300} alt={'hide'} />
                  </div>
                  <p className='mb-1 w-full text-center font-bold'>Keep skinned hide</p>
                  <CheckboxGroup name='hide' options={[{ value: 'Keep skinned hide', label: 'Additional $15' }]} register={register} />
                </div>
                <div className='flex flex-col items-center justify-start gap-1'>
                  <div className='relative aspect-square w-full overflow-hidden rounded-md'>
                    <Image
                      src={'/euro-mount.jpg'}
                      className='absolute inset-0 h-full w-full object-cover'
                      width={500}
                      height={300}
                      alt={'euro-mount'}
                    />
                  </div>
                  <p className='w-full text-center font-bold'>Euro Mount</p>
                  <Select
                    className='w-full'
                    name='euroMount'
                    register={register}
                    options={[
                      { value: 'none', label: 'Select Option' },
                      { value: 'Keep head', label: 'Keep Head' },
                      { value: 'pork', label: 'Boiled Finished Mount - $145' },
                      { value: 'both', label: 'Beetles Finished Mount - $175' },
                    ]}
                  ></Select>
                </div>

                <p className='col-span-3 mt-2 text-center italic'>NOT MOUNTED just the cape for a mounting. Hide and saved for you, NOT TANNED.</p>
                <div className='col-span-3'>
                  <Textarea rows={2} name={`capeHideNotes`} label='Special Instructions' register={register} />
                </div>
              </div>
            </>
          )}
          {currentStep === 3 && (
            <>
              <div className='grid grid-cols-7'>
                <div className='col-span-5 col-start-2 flex flex-col gap-5'>
                  <div className='relative aspect-[4/3] w-full overflow-hidden rounded-md'>
                    <Image src={'/deer.jpg'} className='absolute inset-0 h-full w-full object-cover' width={500} height={300} alt={'deer'} />
                  </div>
                  <div className='pl-2'>
                    <Select
                      className='w-full'
                      name='skinnedOrBoneless'
                      register={register}
                      required
                      options={[
                        { value: 'skinned', label: 'Skinned, Cut, Ground, Vacuum packed - $95' },
                        { value: 'boneless', label: 'Boneless, 100% deboned already' },
                      ]}
                    ></Select>

                    <p className='mt-2 text-center italic'>
                      Must select &quot;Skinned&quot; even if already skinned or quartered.
                      <br />
                      There is no cost if your deer is 100% deboned.
                    </p>
                  </div>
                  <div>
                    <Textarea rows={2} name={`skinnedBonelessNotes`} label='Special Instructions' register={register} />
                  </div>
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
                      { value: 'Whole', label: 'Whole' },
                      { value: 'Grind', label: 'Grind' },
                    ]}
                    defaultCheckedValue='Cut in half'
                    register={register}
                    wrapperLabel='Back Strap 1 Preference'
                  />
                  <RadioButtonGroup
                    name='backStrap2Preference'
                    options={[
                      { value: 'Cut in half', label: 'Cut in half' },
                      { value: 'Sliced', label: 'Sliced' },
                      { value: 'Butterfly', label: 'Butterfly' },
                      { value: 'Whole', label: 'Whole' },
                      { value: 'Grind', label: 'Grind' },
                    ]}
                    defaultCheckedValue='Cut in half'
                    register={register}
                    wrapperLabel='Back Strap 2 Preference'
                  />
                </div>
                <div className='w-full'>
                  <Textarea rows={2} name={`backStrapNotes`} label='Special Instructions' register={register} />
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
                    alt={'back straps'}
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
                  <Textarea rows={2} name={`hindLegNotes`} label='Special Instructions' register={register} />
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
                    className='h-full w-full translate-x-8 translate-y-8 scale-125 object-cover'
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
                  <Textarea rows={2} name={`roastNotes`} label='Special Instructions' register={register} />
                </div>
              </div>
            </>
          )}

          {currentStep === 7 && (
            <>
              <h3 className='mb-2 text-center text-display-sm font-bold'>Ground Venison Options</h3>

              <div className='grid grid-cols-2 gap-6'>
                <h3 className='col-span-2 text-center text-display-xs font-bold'>Ground Venison</h3>
                <div className='relative overflow-hidden rounded-md'>
                  <Image
                    src='/ground_venison.jpg'
                    className={'absolute inset-0 h-full w-full object-cover'}
                    width={500}
                    height={300}
                    alt='Ground Venison'
                  />
                </div>
                <div className='flex flex-col gap-3'>
                  <div className='flex flex-col gap-1'>
                    <Select
                      name='groundVenison'
                      label='Ground Venison'
                      register={register}
                      placeholder='Select Option'
                      required
                      options={[
                        { value: 'plain', label: 'Plain' },
                        { value: 'beef', label: 'Add Beef Trim - $5' },
                        { value: 'pork', label: 'Add Pork Trim - $5' },
                        { value: 'both', label: 'Add Beef & Pork Trim - $10' },
                      ]}
                    ></Select>
                  </div>
                  <Textarea rows={3} name={`groundVenisonNotes`} label='Special Instructions' register={register} />
                  <p className='text-md italic'>Ground Venison is the default option if no other options are selected.</p>
                </div>
              </div>

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
              <ul className='mb-4'>
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
                  <span className='font-bold'>Address:</span> {`${values.address}, ${values.city}, ${values.state}, ${values.zip}`}
                </li>
              </ul>

              <h4 className='mb-2 mt-4 text-lg font-bold'>Selected Processing Options:</h4>
              <ul className='mb-4'>
                <li>
                  <span className='font-bold'>Cape:</span> {values.cape ? 'Yes' : 'No'}
                </li>
                <li>
                  <span className='font-bold'>Hide:</span> {values.hide ? 'Yes' : 'No'}
                </li>
                <li>
                  <span className='font-bold'>Skinned:</span> {values.isSkinned}
                </li>
                <li>
                  <span className='font-bold'>Back Strap Preferences:</span> {values.backStraps1Preference}, {values.backStrap2Preference}
                </li>
                <li>
                  <span className='font-bold'>Hind Leg Preferences:</span> {values.hindLegPreference1}, {values.hindLegPreference2}
                </li>
                <li>
                  <span className='font-bold'>Roast Preference:</span> {values.roast}
                </li>
              </ul>

              <h4 className='mb-2 mt-4 text-lg font-bold'>Specialty Meat Selections:</h4>
              <ul className='mb-4'>
                {/* Iterate over specialty meat selections and display them */}
                {Object.entries(values)
                  .filter(
                    ([key, value]) =>
                      key.startsWith('groundVenison') ||
                      key.startsWith('trailBologna') ||
                      key.startsWith('garlicRingBologna') ||
                      key.startsWith('summerSausage') ||
                      key.startsWith('smokedKielbasaSausage') ||
                      key.startsWith('italianSausageLinks') ||
                      key.startsWith('countryBreakfastSausage') ||
                      key.startsWith('babyLinks') ||
                      key.startsWith('snackSticks') ||
                      key.startsWith('hotDogs') ||
                      key.startsWith('jerkyRestructured')
                  )
                  .map(([key, value]) => {
                    return value ? (
                      <li key={key}>
                        <span className='font-bold'>{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}:</span> Yes
                      </li>
                    ) : null;
                  })}
              </ul>

              {/* Calculate and render the total price */}
              <p className='mt-4'>
                <span className='font-bold'>Total Price:</span> $
                {
                  // Calculate the total price based on the selected options
                  calculateTotalPrice(values)
                }
              </p>

              <div>
                <Textarea rows={2} name={`recapNotes`} label='Special Instructions' register={register} />
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

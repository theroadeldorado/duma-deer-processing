import { useState, useEffect } from 'react';
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
import Summary from './Summary';
import { calculateTotalPrice } from 'lib/priceCalculations';
import PhoneInput from './PhoneInput';

const TOTAL_STEPS = 7;

const CheckInForm = () => {
  const form = useForm<DeerT>();
  const [currentStep, setCurrentStep] = useState(1);
  const [isHindLegPreference1, setIsHindLegPreference1] = useState('Grind');
  const [isHindLegPreference2, setIsHindLegPreference2] = useState('Grind');

  const handleHindLegPreference1 = (event: any) => {
    setIsHindLegPreference1(event);
    if (event !== 'Steaks' && isHindLegPreference2 !== 'Steaks') {
      form.setValue('tenderizedCubedSteaks', '');
    }
  };

  const handleHindLegPreference2 = (event: any) => {
    setIsHindLegPreference2(event);
    if (event !== 'Steaks' && isHindLegPreference1 !== 'Steaks') {
      form.setValue('tenderizedCubedSteaks', '');
    }
  };

  const progressPercentage = ((currentStep - 1) / TOTAL_STEPS) * 100;
  const { register, watch } = form;
  const values = watch();

  const mutation = useMutation({
    url: '/api/auth/deer',
    method: 'POST',
    onSuccess: async (data: any) => {
      router.push('/success');
    },
  });

  const handleSubmit: SubmitHandler<DeerT> = async (formData) => {
    const totalPrice = calculateTotalPrice(formData);

    const data = {
      ...formData,
      _id: formData.tagNumber + Date.now(),
      name: formData.firstName + ' ' + formData.lastName,
      totalPrice: totalPrice,
    };

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
                <div className='hidden'>
                  <Input label='Name' type='text' name='name' />
                </div>
                <div className='hidden'>
                  <Input label='fullAddress' type='text' name='fullAddress' />
                </div>
                <Input
                  label='First Name'
                  type='text'
                  name='firstName'
                  required
                  onChange={(e) => {
                    form.setValue('name', e.target.value + ' ' + form.watch('lastName'));
                  }}
                />
                <Input
                  label='Last Name'
                  type='text'
                  name='lastName'
                  required
                  onChange={(e) => {
                    form.setValue('name', form.watch('firstName') + ' ' + e.target.value);
                  }}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                {/* <Input label='Phone' type='text' name='phone' required placeholder='123-456-7890' /> */}
                <PhoneInput label='Phone' name='phone' required />

                <RadioButtonGroup
                  name='communication'
                  required
                  options={[
                    { value: 'Call', label: 'Call' },
                    { value: 'Text', label: 'Text' },
                  ]}
                  defaultCheckedValue='Text'
                  wrapperLabel='Communication'
                />
              </div>

              <Input label='Tag Number' type='text' name='tagNumber' required />
              <div className='grid grid-cols-2 gap-4'>
                <Select
                  name='stateHarvestedIn'
                  label='State Harvested In*'
                  placeholder='Select State'
                  defaultValue='OH'
                  required
                  options={[
                    { value: 'OH', label: 'Ohio' },
                    { value: 'WV', label: 'West Virginia' },
                    { value: 'PA', label: 'Pennsylvania' },
                    { value: 'Other', label: 'Other' },
                  ]}
                ></Select>

                <Select
                  name='buckOrDoe'
                  label='Deer Type*'
                  placeholder='Select Type'
                  required
                  options={[
                    { value: 'Doe', label: 'Doe' },
                    { value: 'Buck', label: 'Buck' },
                    { value: 'Button Buck', label: 'Button Buck' },
                    { value: 'Boneless', label: 'Boneless' },
                    { value: 'Other', label: 'Other' },
                  ]}
                ></Select>
              </div>

              <Input
                label='Address'
                type='text'
                name='address'
                required
                onChange={(e) => {
                  form.setValue('fullAddress', e.target.value + '\n ' + form.watch('city') + ', ' + form.watch('state') + ' ' + form.watch('zip'));
                }}
              />
              <div className='grid grid-cols-5 gap-4'>
                <div className='col-span-2'>
                  <Input
                    label='City'
                    type='text'
                    name='city'
                    required
                    onChange={(e) => {
                      form.setValue(
                        'fullAddress',
                        form.watch('address') + '\n ' + e.target.value + ', ' + form.watch('state') + ' ' + form.watch('zip')
                      );
                    }}
                  />
                </div>
                <Input
                  label='State'
                  type='text'
                  name='state'
                  defaultValue='OH'
                  required
                  onChange={(e) => {
                    form.setValue(
                      'fullAddress',
                      form.watch('address') + '\n ' + form.watch('city') + ', ' + e.target.value + ' ' + form.watch('zip')
                    );
                  }}
                />
                <div className='col-span-2'>
                  <Input
                    label='Zip'
                    type='number'
                    name='zip'
                    required
                    onChange={(e) => {
                      form.setValue(
                        'fullAddress',
                        form.watch('address') + '\n ' + form.watch('city') + ', ' + form.watch('state') + ' ' + e.target.value
                      );
                    }}
                  />
                </div>
              </div>
              <p className='text-center italic'>All fields on this page are required to continue.</p>
            </>
          )}
          {currentStep === 2 && (
            <>
              <div className='flex flex-col gap-5'>
                <div className='relative aspect-[8/3] w-full overflow-hidden rounded-md'>
                  <Image src={'/deer.jpg'} className='absolute inset-0 h-full w-full object-cover' width={500} height={300} alt={'deer'} />
                </div>

                <div className='pl-2'>
                  <Select
                    className='w-full'
                    name='skinnedOrBoneless'
                    required
                    options={[
                      { value: 'Skinned, Cut, Ground, Vacuum packed', label: 'Skinned, Cut, Ground, Vacuum packed - $95' },
                      { value: 'Boneless', label: 'Boneless, 100% deboned already' },
                    ]}
                    defaultValue='Skinned, Cut, Ground, Vacuum packed'
                  ></Select>

                  <p className='mt-2 text-center italic'>
                    Must select &quot;Skinned&quot; even if already skinned or quartered.
                    <br />
                    There is no cost if your deer is 100% deboned. We will need to weigh your deer before processing.
                  </p>
                </div>
                {/* <div>
                  <Textarea rows={2} name={`skinnedBonelessNotes`} label='Special Instructions'  />
                </div> */}
              </div>
            </>
          )}
          {currentStep === 3 && (
            <>
              <div className='grid grid-cols-3 gap-6'>
                <div className='flex flex-col items-center justify-start gap-1'>
                  <div className='relative aspect-square w-full overflow-hidden rounded-md'>
                    <Image src={'/cape.png'} className='absolute inset-0 h-full w-full object-cover' width={500} height={300} alt={'cape'} />
                  </div>
                  <p className='mb-1 w-full text-center font-bold'>Cape for shoulder mount</p>
                  <CheckboxGroup name='cape' options={[{ value: 'Cape for shoulder mount', label: 'Additional $50' }]} />
                </div>
                <div className='flex flex-col items-center justify-start gap-1'>
                  <div className='relative aspect-square w-full overflow-hidden rounded-md'>
                    <Image src={'/hide.jpg'} className='absolute inset-0 h-full w-full object-cover' width={500} height={300} alt={'hide'} />
                  </div>
                  <p className='mb-1 w-full text-center font-bold'>Keep skinned hide</p>
                  <CheckboxGroup name='hide' options={[{ value: 'Keep skinned hide', label: 'Additional $15' }]} />
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
                    options={[
                      { value: 'false', label: 'Select Option' },
                      { value: 'Keep head', label: 'Keep Head  - Take Today' },
                      { value: 'Boiled finished mount', label: 'Boiled Finished Mount - $145' },
                      { value: 'Beetles finished mount', label: 'Beetles Finished Mount - $175' },
                    ]}
                  ></Select>
                </div>

                <p className='col-span-3 mt-2 text-center italic'>NOT MOUNTED just the cape for a mounting. Hide and saved for you, NOT TANNED.</p>
                {/* <div className='col-span-3'>
                  <Textarea rows={2} name={`capeHideNotes`} label='Special Instructions'  />
                </div> */}
              </div>
            </>
          )}

          {currentStep === 4 && (
            <>
              <div className='flex flex-col items-center justify-center gap-4'>
                <div className='mb-6 aspect-square w-48 overflow-hidden rounded-full border-[5px] border-dashed border-[#E28532] bg-tan-1'>
                  <Image src={'/back_straps.svg'} className='h-full w-full scale-150 object-cover' width={500} height={300} alt={'backstraps'} />
                </div>
                <div className='grid w-full grid-cols-1 gap-8'>
                  <div>
                    <p className='mb-1 w-full font-bold'>Back Strap Preference</p>
                    <Select
                      className='w-full'
                      name='backStrapsPreference'
                      required
                      options={[
                        { value: 'Cut in half', label: 'Cut in half' },
                        { value: 'Sliced', label: 'Sliced' },
                        { value: 'Butterfly', label: 'Butterfly' },
                        { value: 'Whole', label: 'Whole' },
                        { value: 'Grind', label: 'Grind' },
                      ]}
                      defaultValue='Cut in half'
                    ></Select>
                  </div>
                </div>
                <p className='col-span-3 mt-2 text-center italic'>Inner Tenderloins always left whole.</p>

                <div className='w-full'>
                  <Textarea rows={2} name={`backStrapNotes`} label='Special Instructions' />
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
                <div className='grid w-full grid-cols-2 gap-8'>
                  <div>
                    <p className='mb-1 w-full font-bold'>Hind Leg Preference Leg 1</p>
                    <Select
                      className='w-full'
                      name='hindLegPreference1'
                      onChange={handleHindLegPreference1}
                      required
                      options={[
                        { value: 'Steaks', label: 'Steaks' },
                        { value: 'Smoked Whole Ham', label: 'Smoked Whole Ham - $40' },
                        { value: 'Whole Muscle Jerky - Mild', label: 'Whole Muscle Jerky - $35 - Mild' },
                        { value: 'Whole Muscle Jerk - Hot', label: 'Whole Muscle Jerky - $35 - Hot' },
                        { value: 'Whole Muscle Jerky - Teriyaki', label: 'Whole Muscle Jerky - $35 - Teriyaki' },
                        { value: 'Grind', label: 'Ground Venison' },
                      ]}
                      defaultValue='Grind'
                    ></Select>
                  </div>
                  <div>
                    <p className='mb-1 w-full font-bold'>Hind Leg Preference Leg 2</p>
                    <Select
                      className='w-full'
                      name='hindLegPreference2'
                      onChange={handleHindLegPreference2}
                      required
                      options={[
                        { value: 'Steaks', label: 'Steaks' },
                        { value: 'Smoked Whole Ham', label: 'Smoked Whole Ham - $40' },
                        { value: 'Whole Muscle Jerky - Mild', label: 'Whole Muscle Jerky - $35 - Mild' },
                        { value: 'Whole Muscle Jerk - Hot', label: 'Whole Muscle Jerky - $35 - Hot' },
                        { value: 'Whole Muscle Jerky - Teriyaki', label: 'Whole Muscle Jerky - $35 - Teriyaki' },
                        { value: 'Grind', label: 'Ground Venison' },
                      ]}
                      defaultValue='Grind'
                    ></Select>
                  </div>
                  {(isHindLegPreference1 === 'Steaks' || isHindLegPreference2 === 'Steaks') && (
                    <div className='col-span-2'>
                      <CheckboxGroup
                        name='tenderizedCubedSteaks'
                        options={[{ value: 'Tenderized Cubed Steaks', label: 'Tenderized Cubed Steaks - $5' }]}
                      />
                    </div>
                  )}
                  <div>
                    <div className='relative aspect-[3/2] w-full overflow-hidden rounded-md'>
                      <Image
                        src={'/whole-muscle-jerky.jpg'}
                        className='absolute inset-0 h-full w-full object-cover'
                        width={500}
                        height={300}
                        alt={'whole muscle jerky'}
                      />
                    </div>
                    <p className='mb-1 w-full text-center font-bold'>Whole Muscle Jerky</p>
                  </div>
                  <div>
                    <div className='relative aspect-[3/2] w-full overflow-hidden rounded-md'>
                      <Image src={'/ham.jpg'} className='absolute inset-0 h-full w-full object-cover' width={500} height={300} alt={'Ham'} />
                    </div>
                    <p className='mb-1 w-full text-center font-bold'>Smoked Whole Ham</p>
                  </div>
                </div>
              </div>

              <div className='w-full'>
                <Textarea rows={2} name={`hindLegNotes`} label='Special Instructions' />
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
                <div className='w-full'>
                  <p className='mb-1 w-full font-bold'>Roast Preference</p>
                  <Select
                    className='w-full'
                    name='roast'
                    required
                    options={[
                      { value: '2 Roasts, Grind Rest', label: '2 Roasts, Ground Venison for the rest' },
                      { value: 'As many as possible', label: 'As many as possible' },
                      { value: 'Grind', label: 'Ground Venison' },
                    ]}
                    defaultValue='Grind'
                  ></Select>
                </div>

                <div className='w-full'>
                  <Textarea rows={2} name={`roastNotes`} label='Special Instructions' />
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
                      label='Ground Venison Options'
                      placeholder='Select Option'
                      defaultValue='Plain'
                      options={[
                        { value: 'Plain', label: 'Plain' },
                        { value: 'Add Beef Trim', label: 'Add Beef Trim - $5' },
                        { value: 'Add Pork Trim', label: 'Add Pork Trim - $5' },
                        { value: 'Add Beef & Pork Trim', label: 'Add Beef & Pork Trim - $10' },
                      ]}
                    ></Select>
                  </div>
                  <div className='flex flex-col gap-1'>
                    <Select
                      name='groundVenisonAmount'
                      label='Ground Venison Amount'
                      placeholder='Select Option'
                      defaultValue='Remainder'
                      options={[
                        { value: 'Remainder', label: 'Remainder of meat' },
                        { value: 'None - All specialty meat', label: 'None - All specialty meat' },
                      ]}
                    ></Select>
                  </div>
                  {/* <Textarea rows={3} name={`groundVenisonNotes`} label='Special Instructions'  /> */}
                  <p className='text-md italic'>
                    If you do not select any other specialty meats you will receive all ground venison. If you select only specific weights for
                    specialty meat you will receive the remainder in ground venison.
                  </p>
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
                  { name: 'snackSticksHotHotPepperJackCheese', label: '🔥 HOT Hot Pepper Jack Cheese Snack Sticks', price: 30 },
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
          {currentStep === 8 && <Summary formValues={values} />}

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
                className='inline-flex gap-2 disabled:cursor-not-allowed'
                onClick={() => setCurrentStep((prevStep) => prevStep + 1)}
                disabled={currentStep === 1 && !form.formState.isValid}
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
                <Button type='submit' className='inline-flex origin-right scale-150 gap-2 bg-[#E28532]'>
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

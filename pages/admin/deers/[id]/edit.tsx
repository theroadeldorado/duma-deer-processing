import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';

import AdminPage from '@/components/layouts/Admin';
import Button from 'components/Button';
import Input from 'components/Input';
import Form from 'components/Form';
import RadioButtonGroup from '@/components/RadioButtonGroup';
import CheckboxGroup from '@/components/CheckboxGroup';
import Textarea from '@/components/Textarea';
import Select from '@/components/Select';
import SpecialtyMeat from '@/components/SpecialtyMeat';

import { DeerT, DeerInputT } from 'lib/types';
import { calculateTotalPrice, calculateCapeHideTotal } from 'lib/priceCalculations';
import { DeerZ } from '@/lib/zod';
import useMutation from 'hooks/useMutation';
import getSecureServerSideProps from '@/lib/getSecureServerSideProps';
import { getDeer } from '@/lib/mongo';
import { ParsedUrlQuery } from 'querystring';

// Define your props type
type Props = {
  data?: DeerT;
  isNew?: boolean;
};

export default function EditDeer({ data, isNew }: Props) {
  const router = useRouter();
  const [calculatedPrice, setCalculatedPrice] = useState<number>(Number(data?.totalPrice) || 0);

  const [isHindLegPreference1, setIsHindLegPreference1] = useState('Grind');
  const [isHindLegPreference2, setIsHindLegPreference2] = useState('Grind');

  const handleHindLegPreference1 = (event: any) => {
    setIsHindLegPreference1(event);
  };

  const handleHindLegPreference2 = (event: any) => {
    setIsHindLegPreference2(event);
  };

  const form = useForm<DeerInputT>({
    defaultValues: data,
    resolver: zodResolver(DeerZ),
  });

  // State for balance calculation
  const [balance, setBalance] = useState<number>(0);

  // Update calculated price whenever form values change
  useEffect(() => {
    const formData = form.getValues();
    const processingPrice = calculateTotalPrice(formData);
    const capeHidePrice = calculateCapeHideTotal(formData);
    const totalPrice = processingPrice + capeHidePrice;
    setCalculatedPrice(totalPrice);

    // Calculate balance
    const totalDeposits =
      Number(form.getValues('deposit') || 0) + Number(form.getValues('capeHideDeposit') || 0) + Number(form.getValues('amountPaid') || 0);
    setBalance(totalPrice - totalDeposits);

    // Update capeHideTotal field if it's not set manually
    if (!form.getValues('capeHideTotal') && capeHidePrice > 0) {
      form.setValue('capeHideTotal', capeHidePrice);
    }
  }, [form.watch()]);

  const mutation = useMutation({
    url: isNew ? '/api/deers/add' : `/api/deers/${data?._id}/update`,
    method: isNew ? 'POST' : 'PUT',
    successMessage: isNew ? 'Deer added successfully' : 'Deer updated successfully',
    onSuccess: (response) => {
      router.push('/admin/deers');
    },
    onError: (error) => {
      console.error('Edit Form - Mutation error:', error);
    },
  });

  const del = useMutation({
    url: `/api/deers/${encodeURIComponent(data?._id || '')}/delete`,
    method: 'DELETE',
    successMessage: 'Deer deleted successfully',
    onSuccess: () => {
      router.push('/admin/deers');
    },
    onError: (error) => {
      console.error('Delete error:', error);
    },
  });

  const deleteDeer = async () => {
    if (!data?._id) {
      console.error('No deer ID available for deletion');
      return;
    }
    if (!confirm('Are you sure you want to permanently delete this deer record?')) return;
    del.mutate(null);
  };

  const handleSubmit = async (formData: DeerInputT) => {
    // Parse numeric fields to ensure they're saved as numbers
    const capeHideDepositValue = formData.capeHideDeposit ? Number(formData.capeHideDeposit) : undefined;
    const depositValue = formData.deposit ? Number(formData.deposit) : undefined;
    const amountPaidValue = formData.amountPaid ? Number(formData.amountPaid) : undefined;
    const capeHideTotalValue = calculateCapeHideTotal(formData);

    // Make sure we're explicitly including capeHideDeposit and capeHideTotal as numbers
    const updatedData = {
      ...formData,
      totalPrice: calculatedPrice,
      capeHideDeposit: capeHideDepositValue,
      capeHideTotal: capeHideTotalValue,
      deposit: depositValue,
      amountPaid: amountPaidValue,
      approxNeckMeasurement: formData.approxNeckMeasurement ? Number(formData.approxNeckMeasurement) : undefined,
    };

    console.log('Submitting data with capeHideDeposit:', capeHideDepositValue);
    mutation.mutate(updatedData);
  };

  return (
    <AdminPage title={isNew ? 'Add Deer' : 'Edit Deer'}>
      <Form form={form} onSubmit={handleSubmit} className='mx-auto max-w-6xl bg-white shadow sm:rounded-lg'>
        <div className='mb-20 flex flex-col gap-12 p-8'>
          <div className='grid grid-cols-4 gap-4'>
            <div className='col-span-4 mb-10 flex items-center justify-start gap-4'>
              <div className='mt-2 h-px w-full grow bg-gray-500'></div>
              <h3 className='shrink-0 text-center text-display-md font-bold'>Customer Information</h3>
              <div className='mt-2 h-px w-full grow bg-gray-500'></div>
            </div>
            <div className='hidden'>
              <Input label='Full Address' type='text' name='fullAddress' />
              <Input label='Full Name' type='text' name='name' />
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

            <Input label='Confirmation Number' type='text' name='tagNumber' required />
            <Select
              name='stateHarvestedIn'
              label='State Harvested In'
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
              label='Deer Type'
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

            <Input
              label='Address'
              type='text'
              name='address'
              required
              onChange={(e) => {
                form.setValue('fullAddress', e.target.value + '\n ' + form.watch('city') + ', ' + form.watch('state') + ' ' + form.watch('zip'));
              }}
            />

            <Input
              label='City'
              type='text'
              name='city'
              required
              onChange={(e) => {
                form.setValue('fullAddress', form.watch('address') + '\n ' + e.target.value + ', ' + form.watch('state') + ' ' + form.watch('zip'));
              }}
            />

            <Input
              label='State'
              type='text'
              name='state'
              defaultValue='OH'
              required
              onChange={(e) => {
                form.setValue('fullAddress', form.watch('address') + '\n ' + form.watch('city') + ', ' + e.target.value + ' ' + form.watch('zip'));
              }}
            />

            <Input
              label='Zip'
              type='number'
              maxLength={5}
              name='zip'
              required
              onChange={(e) => {
                form.setValue('fullAddress', form.watch('address') + '\n ' + form.watch('city') + ', ' + form.watch('state') + ' ' + e.target.value);
              }}
            />

            <Input label='Phone' type='text' name='phone' required />
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
          <div className='flex flex-col'>
            <div className='mb-10 flex items-center justify-start gap-4'>
              <div className='mt-2 h-px w-full grow bg-gray-500'></div>
              <h3 className='shrink-0 text-center text-display-md font-bold'>Cutting Instructions</h3>
              <div className='mt-2 h-px w-full grow bg-gray-500'></div>
            </div>

            {/* Skinned or Boneless */}
            <div className='mb-10 grid grid-cols-2 gap-4 border-b border-dashed border-gray-300 pb-10'>
              <div>
                <p className='mb-1 font-bold'>Skinned or Boneless</p>
                <Select
                  className='w-full'
                  name='skinnedOrBoneless'
                  required
                  options={[
                    { value: 'Skinned, Cut, Ground, Vacuum packed', label: 'Skinned, Cut, Ground, Vacuum packed - $110' },
                    { value: 'Boneless', label: 'Boneless, 100% deboned already' },
                    { value: 'Donation', label: 'Donation - $0' },
                  ]}
                ></Select>
              </div>
              <Textarea rows={3} name={`skinnedBonelessNotes`} label='Special Instructions' />
            </div>

            {/* Cape, Hide and Euro Mount */}
            <div className='mb-10 grid grid-cols-2 gap-4 border-b border-dashed border-gray-300 pb-10'>
              <div className='flex flex-col gap-2'>
                <div>
                  <p className='mb-1 font-bold'>Cape for shoulder mount</p>
                  <Select
                    className='w-full'
                    name='cape'
                    required
                    options={[
                      { value: '', label: 'Select Option' },
                      { value: 'Cape for shoulder mount', label: 'Additional $50' },
                      { value: 'Shoulder mount', label: 'Shoulder Mount - $111' },
                    ]}
                  ></Select>

                  {/* <CheckboxGroup name='cape' options={[{ value: 'Cape for shoulder mount', label: 'Cape for shoulder mount - Additional $50' }]} /> */}
                  {/* <label>
                    <input type='checkbox' name='cape' className='mr-2' />
                    Cape for shoulder mount - Additional $50
                  </label> */}
                </div>
                <div>
                  <p className='mb-1 font-bold'>Hide Options</p>
                  <Select
                    className='w-full'
                    name='hide'
                    required
                    options={[
                      { value: '', label: 'Select Option' },
                      { value: 'Save Hide', label: 'Save Hide - Take Today - $15' },
                      { value: 'Tanned Hair on', label: 'Tanned Hair on - $200' },
                    ]}
                  ></Select>
                  {/* <CheckboxGroup name='hide' options={[{ value: 'Keep skinned hide', label: 'Keep skinned hide - Additional $15' }]} /> */}
                  {/* <label>
                    <input type='checkbox' name='hide' className='mr-2' />
                    Keep skinned hide - Additional $15
                  </label> */}
                </div>
                <p className='font-bold'>Euro Mount Options</p>
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
              <div className='flex flex-col gap-4'>
                <Textarea rows={3} name={`capeHideNotes`} label='Special Instructions' />

                {/* Shoulder Mount Pose Details - Always present but hidden when not needed */}
                <div
                  className={(() => {
                    const capeValue = form.watch('cape');
                    return capeValue === 'Shoulder mount' ? 'border-green-200 bg-green-50 space-y-4 rounded-md border p-4' : 'hidden';
                  })()}
                >
                  <h4 className='text-green-800 text-lg font-medium'>Shoulder Mount Pose Details</h4>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>Head position - deer faces from the wall</label>
                      <Select
                        className='w-full'
                        name='shoulderMountHeadPosition'
                        options={[
                          { value: '', label: 'Select Position' },
                          { value: 'Upright Left', label: 'Upright Left' },
                          { value: 'Upright Right', label: 'Upright Right' },
                          { value: 'Semi Upright Left', label: 'Semi Upright Left' },
                          { value: 'Semi Upright Right', label: 'Semi Upright Right' },
                          { value: 'Semi Sneak Left', label: 'Semi Sneak Left' },
                          { value: 'Semi Sneak Right', label: 'Semi Sneak Right' },
                        ]}
                      />
                    </div>

                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>Ear Position</label>
                      <Select
                        className='w-full'
                        name='shoulderMountEarPosition'
                        options={[
                          { value: '', label: 'Select Position' },
                          { value: 'Forward', label: 'Forward' },
                          { value: 'Back', label: 'Back' },
                          { value: 'Rotated', label: 'Rotated' },
                        ]}
                      />
                    </div>

                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>Rack ID</label>
                      <Input type='text' className='w-full' name='rackId' placeholder='Rack ID' />
                    </div>

                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>Cape ID</label>
                      <Input type='text' className='w-full' name='capeId' placeholder='Cape ID' />
                    </div>

                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>Cape Morse Code #</label>
                      <Input type='text' className='w-full' name='capeMorseCode' placeholder='Cape Morse Code #' />
                    </div>

                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>Approx Neck Measurement (inches)</label>
                      <Input type='number' step='0.1' min='0' className='w-full' name='approxNeckMeasurement' placeholder='0.0' />
                    </div>

                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>Form Ordered</label>
                      <Input type='text' className='w-full' name='formOrdered' placeholder='Form Ordered' />
                    </div>

                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>Hide Condition</label>
                      <Textarea name='hideCondition' rows={2} placeholder='Gray marks, tick marks, scars, cut, etc...' />
                    </div>

                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>Facial Features/Coloring/notches</label>
                      <Textarea name='facialFeatures' rows={2} placeholder='Facial features, coloring, or notches...' />
                    </div>
                  </div>

                  <div className='col-span-2'>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>Special Instructions</label>
                    <Textarea name='shoulderMountSpecialInstructions' rows={3} placeholder='Any special requests or specific pose instructions...' />
                  </div>
                </div>
              </div>
            </div>

            {/* Back Straps */}
            <div className='mb-10 grid grid-cols-2 gap-4 border-b border-dashed border-gray-300 pb-10'>
              <div>
                <p className='mb-1 font-bold'>Back Straps Preference</p>
                <Select
                  className='w-full'
                  name='backStrapsPreference'
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
              <Textarea rows={3} name={`backStrapNotes`} label='Special Instructions' />
            </div>

            {/* Hind Legs Preference */}
            <div className='mb-10 grid grid-cols-2 gap-4 border-b border-dashed border-gray-300 pb-10'>
              <div>
                <p className='mb-1 font-bold'>Hind Leg 1 Preference</p>
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
                <p className='mb-1 font-bold'>Hind Leg 2 Preference</p>
                <Select
                  className='w-full'
                  name='hindLegPreference2'
                  onChange={handleHindLegPreference2}
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

              <div className='col-span-2'>
                {(isHindLegPreference1 === 'Steaks' || isHindLegPreference2 === 'Steaks') && (
                  <div className='mb-3'>
                    <div className='flex flex-wrap items-center justify-start gap-2 font-normal'>
                      <input name='tenderizedCubedSteaks' type='checkbox' className='checkbox' />
                      <label htmlFor='tenderizedCubedSteaks'>Tenderized Cubed Steaks - $5</label>
                    </div>
                  </div>
                )}

                <Textarea rows={3} name={`hindLegNotes`} label='Special Instructions' />
              </div>
            </div>

            {/* Roasts Preference */}
            <div className='mb-10 grid grid-cols-2 gap-4 border-b border-dashed border-gray-300 pb-10'>
              <div>
                <p className='mb-1 font-bold'>Roasts Preference</p>
                <Select
                  className='w-full'
                  name='roast'
                  options={[
                    { value: '2 Roasts, Grind Rest', label: '2 Roasts, Ground Venison for the rest' },
                    { value: 'As many as possible', label: 'As many as possible' },
                    { value: 'Grind', label: 'Ground Venison' },
                  ]}
                  defaultValue='Grind'
                ></Select>
              </div>
              <Textarea rows={2} name={`roastNotes`} label='Special Instructions' />
            </div>
          </div>

          <div className='flex items-center justify-start '>
            <div className='mt-2 h-px w-full grow bg-gray-500'></div>
            <h3 className='shrink-0 text-center text-display-md font-bold'>Specialty Meats</h3>
            <div className='mt-2 h-px w-full grow bg-gray-500'></div>
          </div>

          <div>
            <div className='mb-10 grid grid-cols-3 gap-4 border-b border-dashed border-gray-300 pb-10 '>
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
              <div className='col-span-3'>
                <Textarea rows={2} name={`groundVenisonNotes`} label='Special Instructions' />
              </div>
            </div>
            <div className='mb-10 grid grid-cols-3 gap-4 border-b border-dashed border-gray-300 pb-10'>
              <h3 className='col-span-3 shrink-0 text-display-xs font-bold'>Trail Bologna</h3>
              <SpecialtyMeat
                admin
                name='Trail Bologna'
                image='/trail_bologna.jpg'
                options={[
                  { name: 'trailBolognaRegular', label: 'Regular', price: 15 },
                  { name: 'trailBolognaCheddarCheese', label: 'Cheddar Cheese', price: 20 },
                  { name: 'trailBolognaHotPepperJackCheese', label: 'Hot Pepper Jack Cheese', price: 20 },
                ]}
              />
              <div className='col-span-3'>
                <Textarea rows={2} name={`trailBolognaNotes`} label='Special Instructions' />
              </div>
            </div>
            <div className='mb-10 grid grid-cols-3 gap-4 border-b border-dashed border-gray-300 pb-10'>
              <h3 className='col-span-3 shrink-0 text-display-xs font-bold'>Garlic Ring Bologna</h3>
              <SpecialtyMeat admin name='Garlic Ring Bologna' options={[{ name: 'garlicRingBologna', label: '', price: 20 }]} />
              <div className='col-span-3'>
                <Textarea rows={2} name={`garlicRingBolognaNotes`} label='Special Instructions' />
              </div>
            </div>
            <div className='mb-10 grid grid-cols-3 gap-4 border-b border-dashed border-gray-300 pb-10'>
              <h3 className='col-span-3 shrink-0 text-display-xs font-bold'>Summer Sausage</h3>
              <SpecialtyMeat
                admin
                name='Summer Sausage'
                options={[
                  { name: 'summerSausageMild', label: 'Mild', price: 15 },
                  { name: 'summerSausageHot', label: 'Hot', price: 15 },
                ]}
              />
              <div className='col-span-3'>
                <Textarea rows={2} name={`summerSausageNotes`} label='Special Instructions' />
              </div>
            </div>
            <div className='mb-10 grid grid-cols-3 gap-4 border-b border-dashed border-gray-300 pb-10'>
              <h3 className='col-span-3 shrink-0 text-display-xs font-bold'>Smoked Kielbasa Sausage</h3>
              <SpecialtyMeat admin name='Smoked Kielbasa Sausage' options={[{ name: 'smokedKielbasaSausage', label: '', price: 17.5 }]} />
              <div className='col-span-3'>
                <Textarea rows={2} name={`smokedKielbasaSausageNotes`} label='Special Instructions' />
              </div>
            </div>
            <div className='mb-10 grid grid-cols-3 gap-4 border-b border-dashed border-gray-300 pb-10'>
              <h3 className='col-span-3 shrink-0 text-display-xs font-bold'>Italian Sausage Links</h3>
              <SpecialtyMeat
                admin
                name='Italian Sausage Links'
                options={[
                  { name: 'italianSausageLinksMild', label: 'Mild', price: 15 },
                  { name: 'italianSausageLinksHot', label: 'Hot', price: 15 },
                ]}
              />
              <div className='col-span-3'>
                <Textarea rows={2} name={`italianSausageLinksNotes`} label='Special Instructions' />
              </div>
            </div>
            <div className='mb-10 grid grid-cols-3 gap-4 border-b border-dashed border-gray-300 pb-10'>
              <h3 className='col-span-3 shrink-0 text-display-xs font-bold'>Country Breakfast Sausage</h3>
              <SpecialtyMeat
                admin
                name='Country Breakfast Sausage'
                options={[{ name: 'countryBreakfastSausage', label: 'Country Breakfast Sausage', price: 15 }]}
              />
              <div className='col-span-3'>
                <Textarea rows={2} name={`countryBreakfastSausageNotes`} label='Special Instructions' />
              </div>
            </div>
            <div className='mb-10 grid grid-cols-3 gap-4 border-b border-dashed border-gray-300 pb-10'>
              <h3 className='col-span-3 shrink-0 text-display-xs font-bold'>Breakfast Linkss</h3>
              <SpecialtyMeat
                admin
                name='Breakfast Linkss'
                options={[
                  { name: 'babyLinksCountry', label: 'Country', price: 20 },
                  { name: 'babyLinksMaple', label: 'Maple', price: 20 },
                ]}
              />
              <div className='col-span-3'>
                <Textarea rows={2} name={`babyLinksNotes`} label='Special Instructions' />
              </div>
            </div>
            <div className='mb-10 grid grid-cols-3 gap-4 border-b border-dashed border-gray-300 pb-10'>
              <h3 className='col-span-3 shrink-0 text-display-xs font-bold'>Snack Sticks</h3>
              <SpecialtyMeat
                admin
                name='Snack Sticks'
                options={[
                  { name: 'snackSticksRegular', label: 'Regular', price: 25 },
                  { name: 'snackSticksCheddarCheese', label: 'Cheddar Cheese', price: 30 },
                  { name: 'snackSticksHotPepperJackCheese', label: 'Hot Pepper Jack Cheese', price: 30 },
                  { name: 'snackSticksHotHotPepperJackCheese', label: '🔥 Hot Hot Pepper Jack Cheese', price: 30 },
                  { name: 'snackSticksHoneyBBQ', label: 'Honey BBQ', price: 30 },
                ]}
              />
              <div className='col-span-3'>
                <Textarea rows={2} name={`snackSticksNotes`} label='Special Instructions' />
              </div>
            </div>
            <div className='mb-10 grid grid-cols-3 gap-4 border-b border-dashed border-gray-300 pb-10'>
              <h3 className='col-span-3 shrink-0 text-display-xs font-bold'>Hot Dogs</h3>
              <SpecialtyMeat
                admin
                name='Hot Dogs'
                options={[
                  { name: 'hotDogsRegular', label: 'Regular', price: 17.5 },
                  { name: 'hotDogsCheddarCheese', label: 'Cheddar Cheese', price: 22.5 },
                  { name: 'hotDogsHotPepperJackCheese', label: 'Hot Pepper Jack Cheese', price: 22.5 },
                ]}
              />
              <div className='col-span-3'>
                <Textarea rows={2} name={`hotDogsNotes`} label='Special Instructions' />
              </div>
            </div>
            <div className='mb-10 grid grid-cols-3 gap-4 border-b border-dashed border-gray-300 pb-10'>
              <h3 className='col-span-3 shrink-0 text-display-xs font-bold'>Jerky Restructured</h3>
              <SpecialtyMeat
                admin
                name='Jerky Restructured'
                options={[
                  { name: 'jerkyRestructuredHot', label: 'Hot', price: 35 },
                  { name: 'jerkyRestructuredMild', label: 'Mild', price: 35 },
                  { name: 'jerkyRestructuredTeriyaki', label: 'Teriyaki', price: 35 },
                ]}
              />
              <div className='col-span-3'>
                <Textarea rows={2} name={`jerkyRestructuredNotes`} label='Special Instructions' />
              </div>
            </div>

            <div className='mt-6 border-t border-dashed border-gray-300 pt-6'>
              <h3 className='mb-4 text-xl font-bold'>Payment Information</h3>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-4'>
                  <div>
                    <label className='mb-1 block font-medium text-gray-700'>Processing Deposit</label>
                    <Input
                      type='number'
                      step='0.01'
                      min='0'
                      className='w-full'
                      name='deposit'
                      placeholder='0.00'
                      onChange={(e) => {
                        // Ensure the value is registered as a number
                        const numValue = e.target.value ? Number(e.target.value) : '';
                        form.setValue('deposit', numValue);
                      }}
                    />
                  </div>
                  <div>
                    <label className='mb-1 block font-medium text-gray-700'>Cape/Hide Deposit</label>
                    <Input
                      type='number'
                      step='0.01'
                      min='0'
                      className='w-full'
                      name='capeHideDeposit'
                      placeholder='0.00'
                      onChange={(e) => {
                        // Ensure the value is registered as a number
                        const numValue = e.target.value ? Number(e.target.value) : '';
                        form.setValue('capeHideDeposit', numValue);
                      }}
                    />
                  </div>
                  <div>
                    <label className='mb-1 block font-medium text-gray-700'>Amount Paid</label>
                    <Input
                      type='number'
                      step='0.01'
                      min='0'
                      className='w-full'
                      name='amountPaid'
                      placeholder='0.00'
                      onChange={(e) => {
                        // Ensure the value is registered as a number
                        const numValue = e.target.value ? Number(e.target.value) : '';
                        form.setValue('amountPaid', numValue);
                      }}
                    />
                  </div>
                </div>
                <div className='space-y-2 text-right'>
                  <div>
                    <p className='mb-1 font-bold'>Processing Total</p>
                    <p className='text-lg'>${calculateTotalPrice(form.getValues()).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className='mb-1 font-bold'>Cape/Hide Total</p>
                    <p className='text-lg'>${calculateCapeHideTotal(form.getValues()).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className='mb-1 font-bold'>Grand Total</p>
                    <p className='text-xl font-bold'>${calculatedPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className='mb-1 font-bold text-blue-600'>Balance</p>
                    <p className='text-lg text-blue-600'>${balance.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex rounded-b-lg bg-gray-50 px-4 py-3 sm:px-6'>
          {!isNew && (
            <Button color='danger' onClick={deleteDeer} disabled={del.isLoading}>
              Delete Entry
            </Button>
          )}
          <div className='ml-auto flex gap-3'>
            <Button type='button' color='secondary' onClick={() => router.push('/admin/deers')} className='font-medium'>
              Cancel
            </Button>
            <Button type='submit' disabled={mutation.isLoading} className='font-medium'>
              {isNew ? 'Add Deer' : 'Save Entry'}
            </Button>
          </div>
        </div>
      </Form>
    </AdminPage>
  );
}

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getServerSideProps = getSecureServerSideProps(async (context) => {
  const { id } = context.query as Params;

  if (id === 'new') {
    return {
      props: { isNew: true },
    };
  }

  try {
    const deer = await getDeer(id);
    if (!deer) {
      console.log(`Deer with ID ${id} not found.`);
      return { notFound: true };
    }
    return {
      props: { data: deer },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return { notFound: true };
  }
}, true);

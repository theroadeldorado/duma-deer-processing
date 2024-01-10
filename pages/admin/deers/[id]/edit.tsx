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
import { calculateTotalPrice } from 'lib/priceCalculations';
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

  // Update calculated price whenever form values change
  useEffect(() => {
    const formData = form.getValues();
    const newPrice = calculateTotalPrice(formData).toFixed(2);
    setCalculatedPrice(parseFloat(newPrice));
  }, [form.watch()]);

  const mutation = useMutation({
    url: isNew ? '/api/deers/add' : `/api/deers/${data?._id}/update`,
    method: isNew ? 'POST' : 'PUT',
    successMessage: isNew ? 'Deer added successfully' : 'Deer updated successfully',
    onSuccess: () => router.push('/admin/deers'),
  });

  const del = useMutation({
    url: `/api/deers/${data?._id}/delete`,
    method: 'DELETE',
    successMessage: 'Deer deleted successfully',
    onSuccess: () => {
      router.push('/admin/deers');
    },
  });

  const deleteDeer = async () => {
    if (!confirm('Are you sure you want to permanently delete this deer record?')) return;
    del.mutate({});
  };

  const handleSubmit = async (formData: DeerInputT) => {
    const updatedData = {
      ...formData,
      totalPrice: calculatedPrice,
    };
    mutation.mutate(updatedData);
  };

  return (
    <AdminPage title={isNew ? 'Add Deer' : 'Edit Deer'}>
      <Form form={form} onSubmit={handleSubmit} className='max-w-6xl mx-auto bg-white shadow sm:rounded-lg'>
        <div className='flex flex-col gap-12 p-8 mb-20'>
          <div className='grid grid-cols-4 gap-4'>
            <div className='flex items-center justify-start col-span-4 gap-4 mb-10'>
              <div className='w-full h-px mt-2 bg-gray-500 grow'></div>
              <h3 className='font-bold text-center shrink-0 text-display-md'>Customer Information</h3>
              <div className='w-full h-px mt-2 bg-gray-500 grow'></div>
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

            <Input label='Tag Number' type='text' name='tagNumber' required />
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
            <div className='flex items-center justify-start gap-4 mb-10'>
              <div className='w-full h-px mt-2 bg-gray-500 grow'></div>
              <h3 className='font-bold text-center shrink-0 text-display-md'>Cutting Instructions</h3>
              <div className='w-full h-px mt-2 bg-gray-500 grow'></div>
            </div>

            {/* Skinned or Boneless */}
            <div className='grid grid-cols-2 gap-4 pb-10 mb-10 border-b border-gray-300 border-dashed'>
              <div>
                <p className='mb-1 font-bold'>Skinned or Boneless</p>
                <Select
                  className='w-full'
                  name='skinnedOrBoneless'
                  required
                  options={[
                    { value: 'Skinned, Cut, Ground, Vacuum packed', label: 'Skinned, Cut, Ground, Vacuum packed - $95' },
                    { value: 'Boneless', label: 'Boneless, 100% deboned already' },
                  ]}
                ></Select>
              </div>
              <Textarea rows={3} name={`skinnedBonelessNotes`} label='Special Instructions' />
            </div>

            {/* Cape, Hide and Euro Mount */}
            <div className='grid grid-cols-2 gap-4 pb-10 mb-10 border-b border-gray-300 border-dashed'>
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
                    ]}
                  ></Select>

                  {/* <CheckboxGroup name='cape' options={[{ value: 'Cape for shoulder mount', label: 'Cape for shoulder mount - Additional $50' }]} /> */}
                  {/* <label>
                    <input type='checkbox' name='cape' className='mr-2' />
                    Cape for shoulder mount - Additional $50
                  </label> */}
                </div>
                <div>
                  <p className='mb-1 font-bold'>Keep skinned hide</p>
                  <Select
                    className='w-full'
                    name='hide'
                    required
                    options={[
                      { value: '', label: 'Select Option' },
                      { value: 'Keep skinned hide', label: 'Additional $15' },
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
              <Textarea rows={3} name={`capeHideNotes`} label='Special Instructions' />
            </div>

            {/* Back Straps */}
            <div className='grid grid-cols-2 gap-4 pb-10 mb-10 border-b border-gray-300 border-dashed'>
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
            <div className='grid grid-cols-2 gap-4 pb-10 mb-10 border-b border-gray-300 border-dashed'>
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
            <div className='grid grid-cols-2 gap-4 pb-10 mb-10 border-b border-gray-300 border-dashed'>
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
            <div className='w-full h-px mt-2 bg-gray-500 grow'></div>
            <h3 className='font-bold text-center shrink-0 text-display-md'>Specialty Meats</h3>
            <div className='w-full h-px mt-2 bg-gray-500 grow'></div>
          </div>

          <div>
            <div className='grid grid-cols-3 gap-4 pb-10 mb-10 border-b border-gray-300 border-dashed '>
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
            <div className='grid grid-cols-3 gap-4 pb-10 mb-10 border-b border-gray-300 border-dashed'>
              <h3 className='col-span-3 font-bold shrink-0 text-display-xs'>Trail Bologna</h3>
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
            <div className='grid grid-cols-3 gap-4 pb-10 mb-10 border-b border-gray-300 border-dashed'>
              <h3 className='col-span-3 font-bold shrink-0 text-display-xs'>Garlic Ring Bologna</h3>
              <SpecialtyMeat admin name='Garlic Ring Bologna' options={[{ name: 'garlicRingBologna', label: '', price: 20 }]} />
              <div className='col-span-3'>
                <Textarea rows={2} name={`garlicRingBolognaNotes`} label='Special Instructions' />
              </div>
            </div>
            <div className='grid grid-cols-3 gap-4 pb-10 mb-10 border-b border-gray-300 border-dashed'>
              <h3 className='col-span-3 font-bold shrink-0 text-display-xs'>Summer Sausage</h3>
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
            <div className='grid grid-cols-3 gap-4 pb-10 mb-10 border-b border-gray-300 border-dashed'>
              <h3 className='col-span-3 font-bold shrink-0 text-display-xs'>Smoked Kielbasa Sausage</h3>
              <SpecialtyMeat admin name='Smoked Kielbasa Sausage' options={[{ name: 'smokedKielbasaSausage', label: '', price: 17.5 }]} />
              <div className='col-span-3'>
                <Textarea rows={2} name={`smokedKielbasaSausageNotes`} label='Special Instructions' />
              </div>
            </div>
            <div className='grid grid-cols-3 gap-4 pb-10 mb-10 border-b border-gray-300 border-dashed'>
              <h3 className='col-span-3 font-bold shrink-0 text-display-xs'>Italian Sausage Links</h3>
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
            <div className='grid grid-cols-3 gap-4 pb-10 mb-10 border-b border-gray-300 border-dashed'>
              <h3 className='col-span-3 font-bold shrink-0 text-display-xs'>Country Breakfast Sausage</h3>
              <SpecialtyMeat
                admin
                name='Country Breakfast Sausage'
                options={[{ name: 'countryBreakfastSausage', label: 'Country Breakfast Sausage', price: 15 }]}
              />
              <div className='col-span-3'>
                <Textarea rows={2} name={`countryBreakfastSausageNotes`} label='Special Instructions' />
              </div>
            </div>
            <div className='grid grid-cols-3 gap-4 pb-10 mb-10 border-b border-gray-300 border-dashed'>
              <h3 className='col-span-3 font-bold shrink-0 text-display-xs'>Baby Links</h3>
              <SpecialtyMeat
                admin
                name='Baby Links'
                options={[
                  { name: 'babyLinksCountry', label: 'Country', price: 20 },
                  { name: 'babyLinksMaple', label: 'Maple', price: 20 },
                ]}
              />
              <div className='col-span-3'>
                <Textarea rows={2} name={`babyLinksNotes`} label='Special Instructions' />
              </div>
            </div>
            <div className='grid grid-cols-3 gap-4 pb-10 mb-10 border-b border-gray-300 border-dashed'>
              <h3 className='col-span-3 font-bold shrink-0 text-display-xs'>Snack Sticks</h3>
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
            <div className='grid grid-cols-3 gap-4 pb-10 mb-10 border-b border-gray-300 border-dashed'>
              <h3 className='col-span-3 font-bold shrink-0 text-display-xs'>Hot Dogs</h3>
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
            <div className='grid grid-cols-3 gap-4 pb-10 mb-10 border-b border-gray-300 border-dashed'>
              <h3 className='col-span-3 font-bold shrink-0 text-display-xs'>Jerky Restructured</h3>
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

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Input label='Amount Paid' type='number' name='amountPaid' />
              </div>
              <div>
                <p className='mb-1 font-bold text-right'>Estimated Price</p>
                <p className='text-xl text-right'>${calculatedPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className='flex px-4 py-3 rounded-b-lg bg-gray-50 sm:px-6'>
          {!isNew && (
            <Button color='danger' onClick={deleteDeer} disabled={del.isLoading}>
              Delete Entry
            </Button>
          )}
          <Button type='submit' disabled={mutation.isLoading} className='ml-auto font-medium'>
            {isNew ? 'Add Deer' : 'Save Entry'}
          </Button>
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

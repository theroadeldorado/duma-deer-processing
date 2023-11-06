import { useState } from 'react';
import { ParsedUrlQuery } from 'querystring';
import AdminPage from '@/components/layouts/Admin';
import { DeerT, DeerInputT } from 'lib/types';
import Button from 'components/Button';
import Input from 'components/Input';
import Form from 'components/Form';
import { useForm } from 'react-hook-form';
import getSecureServerSideProps from 'lib/getSecureServerSideProps';
import { useRouter } from 'next/router';
import { getDeer } from 'lib/mongo';
import useMutation from 'hooks/useMutation';
import { zodResolver } from '@hookform/resolvers/zod';
import { DeerZ } from '@/lib/zod';
import RadioButtonGroup from '@/components/RadioButtonGroup';
import CheckboxGroup from '@/components/CheckboxGroup';
import Textarea from '@/components/Textarea';
import SpecialtyMeat from '@/components/SpecialtyMeat';

type Props = {
  data?: DeerT;
  isNew?: boolean;
};

export default function EditDeer({ data, isNew }: Props) {
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

  const router = useRouter();
  const form = useForm<DeerInputT>({
    defaultValues: data,
    resolver: zodResolver(DeerZ),
  });

  const mutation = useMutation({
    url: isNew ? '/api/deers/add' : `/api/deers/${data?._id}/update`,
    method: isNew ? 'POST' : 'PUT',
    successMessage: isNew ? 'Deer added successfully' : 'Deer updated successfully',
    onSuccess: () => {
      router.push('/admin/deers');
    },
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

  // Add mutation for deletion as well if needed, similar to the profile deletion mutation above

  return (
    <AdminPage title={isNew ? 'Add Deer' : 'Edit Deer'}>
      <Form form={form} onSubmit={mutation.mutate} className='mx-auto max-w-6xl bg-white shadow sm:rounded-lg'>
        <div className='mb-20 flex flex-col gap-12 p-8'>
          <div className='grid grid-cols-3 gap-4'>
            <h3 className='col-span-3 text-display-sm font-bold'>Customer Information</h3>
            <Input label='Full Name' type='text' name='name' required />
            <Input label='Tag Number' type='text' name='tagNumber' required />
            <Input label='Address' type='text' name='address' required />
            <Input label='City' type='text' name='city' required />
            <Input label='State' type='text' name='state' value='OH' required />
            <Input label='Zip' type='text' name='zip' required />
            <Input label='Phone' type='tel' name='phone' required />
            <RadioButtonGroup
              name='communicationPreference'
              required
              options={[
                { value: 'call', label: 'Call' },
                { value: 'text', label: 'Text' },
              ]}
              defaultCheckedValue='text'
              wrapperLabel='Communication Preference'
            />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <h3 className='col-span-3 text-display-sm font-bold'>Carcass Options</h3>
            <div>
              <CheckboxGroup name='cape' options={[{ value: 'cape', label: 'Cape for shoulder mount. Additional $50' }]} />
              <CheckboxGroup name='hide' options={[{ value: 'hide', label: 'Keep skinned hide. Additional $15' }]} />
              <Textarea rows={2} name={`cape-hide-Notes`} label='Special Instructions' />
            </div>
            <div>
              <RadioButtonGroup
                name='isSkinned'
                options={[
                  { value: 'skinned', label: '$95 - Skinned, Cut, Ground, Vacuum packed.' },
                  { value: 'boneless', label: 'Boneless, 100% deboned already.' },
                ]}
                onChange={handleSkinned}
                defaultCheckedValue='skinned'
                required
              />
              <Textarea rows={2} name={`skinned-boneless-Notes`} label='Special Instructions' />
            </div>
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <h3 className='col-span-3 text-display-sm font-bold'>Back Straps</h3>
            <RadioButtonGroup
              name='backStraps1Preference'
              options={[
                { value: 'Cut in half', label: 'Cut in half' },
                { value: 'Sliced', label: 'Sliced' },
                { value: 'Butterfly', label: 'Butterfly' },
                { value: 'Grind', label: 'Grind' },
              ]}
              defaultCheckedValue='Grind'
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
              wrapperLabel='Back Strap 2 Preference'
            />

            <Textarea rows={2} name={`backStrapNotes`} label='Special Instructions' />
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <h3 className='col-span-3 text-display-sm font-bold'>Hind Legs</h3>
            <div>
              <RadioButtonGroup
                name='hindLegPreference1'
                options={[
                  { value: 'Steaks', label: 'Steaks' },
                  { value: 'Smoked Whole Ham', label: 'Smoked Whole Ham' },
                  { value: 'Jerky', label: 'Jerky' },
                  { value: 'Grind', label: 'Grind' },
                ]}
                defaultCheckedValue='Grind'
                onChange={handleHindLegPreference1}
                wrapperLabel='Hind Leg Preference Leg 1'
              />
              {isHindLegPreference1 === 'Jerky' && (
                <RadioButtonGroup
                  name='hindLegJerky1'
                  options={[
                    { value: 'Hot', label: 'Hot' },
                    { value: 'Mild', label: 'Mild' },
                    { value: 'Teriyaki', label: 'Teriyaki' },
                  ]}
                  defaultCheckedValue='Mild'
                  wrapperLabel='Jerky flavor'
                />
              )}
            </div>
            <div>
              <RadioButtonGroup
                name='hindLegPreference2'
                options={[
                  { value: 'Steaks', label: 'Steaks' },
                  { value: 'Smoked Whole Ham', label: 'Smoked Whole Ham' },
                  { value: 'Jerky', label: 'Jerky' },
                  { value: 'Grind', label: 'Grind' },
                ]}
                defaultCheckedValue='Grind'
                onChange={handleHindLegPreference2}
                wrapperLabel='Hind Leg Preference Leg 2'
              />
              {isHindLegPreference2 === 'Jerky' && (
                <RadioButtonGroup
                  name='hindLegJerky2'
                  options={[
                    { value: 'Hot', label: 'Hot' },
                    { value: 'Mild', label: 'Mild' },
                    { value: 'Teriyaki', label: 'Teriyaki' },
                  ]}
                  defaultCheckedValue='Mild'
                  wrapperLabel='Jerky flavor'
                />
              )}
            </div>
            <div>
              {(isHindLegPreference1 === 'Steaks' || isHindLegPreference2 === 'Steaks') && (
                <CheckboxGroup
                  name='tenderizedCubedSteaks'
                  options={[{ value: 'Tenderized Cubed Steaks', label: '$5 - Tenderized Cubed Steaks.' }]}
                />
              )}
              <Textarea rows={2} name={`hindLegNotes`} label='Special Instructions' />
            </div>
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <h3 className='col-span-3 text-display-sm font-bold'>Roast</h3>
            <RadioButtonGroup
              name='roast'
              options={[
                { value: '2 Roasts, Grind Rest', label: '2 Roasts, Grind Rest' },
                { value: 'As many as possible', label: 'As many as possible' },
                { value: 'Grind', label: 'Grind' },
              ]}
              defaultCheckedValue='Grind'
              wrapperLabel='Roast Preference'
            />
            <Textarea rows={2} name={`roast-Notes`} label='Special Instructions' />
          </div>
          <div className='flex items-center justify-start gap-4'>
            <div className='mt-2 h-px w-full grow bg-gray-500'></div>
            <h3 className='shrink-0 text-center text-display-sm font-bold'>Specialty Meats</h3>
            <div className='mt-2 h-px w-full grow bg-gray-500'></div>
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <h3 className='col-span-3 text-display-sm font-bold'>Ground Venison Options</h3>
            <SpecialtyMeat
              admin
              name='Ground Venison'
              options={[
                { name: 'groundVenisonBeefTrim', label: 'Ground Venison with Beef Trim', price: 5, priceFlat: true },
                { name: 'groundVenisonPorkTrim', label: 'Ground Venison with Pork Trim', price: 5, priceFlat: true },
              ]}
            />
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <h3 className='col-span-3 text-display-sm font-bold'>Trail Bologna</h3>
            <SpecialtyMeat
              admin
              name='Trail Bologna'
              options={[
                { name: 'trailBolognaRegular', label: 'Regular', price: 15 },
                { name: 'trailBolognaCheddarCheese', label: 'Cheddar Cheese', price: 20 },
                { name: 'trailBolognaHotPepperJackCheese', label: 'Hot Pepper Jack Cheese', price: 20 },
              ]}
            />
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <h3 className='col-span-3 text-display-sm font-bold'>Garlic Ring Bologna</h3>
            <SpecialtyMeat admin name='Garlic Ring Bologna' options={[{ name: 'garlicRingBologna', label: 'Garlic Ring Bologna', price: 20 }]} />
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <h3 className='col-span-3 text-display-sm font-bold'>Summer Sausage</h3>
            <SpecialtyMeat
              admin
              name='Summer Sausage'
              options={[
                { name: 'summerSausageMild', label: 'Mild', price: 15 },
                { name: 'summerSausageHot', label: 'Hot', price: 15 },
              ]}
            />
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <h3 className='col-span-3 text-display-sm font-bold'>Smoked Kielbasa Sausage</h3>
            <SpecialtyMeat
              admin
              name='Smoked Kielbasa Sausage'
              options={[{ name: 'smokedKielbasaSausage', label: 'Smoked Kielbasa Sausage', price: 17.5 }]}
            />
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <h3 className='col-span-3 text-display-sm font-bold'>Italian Sausage Links</h3>
            <SpecialtyMeat
              admin
              name='Italian Sausage Links'
              options={[
                { name: 'italianSausageLinksMild', label: 'Mild', price: 15 },
                { name: 'italianSausageLinksHot', label: 'Hot', price: 15 },
              ]}
            />
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <h3 className='col-span-3 text-display-sm font-bold'>Country Breakfast Sausage</h3>
            <SpecialtyMeat
              admin
              name='Country Breakfast Sausage'
              options={[{ name: 'countryBreakfastSausage', label: 'Country Breakfast Sausage', price: 15 }]}
            />
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <h3 className='col-span-3 text-display-sm font-bold'>Baby Links</h3>
            <SpecialtyMeat
              admin
              name='Baby Links'
              options={[
                { name: 'babyLinksCountry', label: 'Country', price: 20 },
                { name: 'babyLinksMaple', label: 'Maple', price: 20 },
              ]}
            />
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <h3 className='col-span-3 text-display-sm font-bold'>Snack Sticks</h3>
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
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <h3 className='col-span-3 text-display-sm font-bold'>Hot Dogs</h3>
            <SpecialtyMeat
              admin
              name='Hot Dogs'
              options={[
                { name: 'hotDogsRegular', label: 'Regular', price: 17.5 },
                { name: 'hotDogsCheddarCheese', label: 'Cheddar Cheese', price: 22.5 },
                { name: 'hotDogsHotPepperJackCheese', label: 'Hot Pepper Jack Cheese', price: 22.5 },
              ]}
            />
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <h3 className='col-span-3 text-display-sm font-bold'>Jerky Restructured</h3>
            <SpecialtyMeat
              admin
              name='Jerky Restructured'
              options={[
                { name: 'jerkyRestructuredHot', label: 'Hot', price: 35 },
                { name: 'jerkyRestructuredMild', label: 'Mild', price: 35 },
                { name: 'jerkyRestructuredTeriyaki', label: 'Teriyaki', price: 35 },
              ]}
            />
          </div>
        </div>

        <div className='flex rounded-b-lg bg-gray-100 px-4 py-3 sm:px-6'>
          {!isNew && (
            <Button color='danger' onClick={deleteDeer} disabled={del.isLoading}>
              Delete Deer
            </Button>
          )}
          <Button type='submit' disabled={mutation.isLoading} className='ml-auto font-medium'>
            {isNew ? 'Add Deer' : 'Save Deer'}
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

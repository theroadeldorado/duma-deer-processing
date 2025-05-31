import Input from '@/components/Input';
import PhoneInput from '@/components/PhoneInput';
import RadioButtonGroup from '@/components/RadioButtonGroup';
import StepWrapper from './StepWrapper';
import { StepProps } from './types';

export default function CustomerInfo(props: StepProps) {
  const { form } = props;

  return (
    <StepWrapper {...props} title='Customer Information'>
      {/* Hidden fields for computed values */}
      <div className='hidden'>
        <Input label='Name' type='text' name='name' />
        <Input label='fullAddress' type='text' name='fullAddress' />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <Input
          label='First Name'
          type='text'
          name='firstName'
          required
          onChange={(e) => {
            form.setValue('name', e.target.value + ' ' + (form.watch('lastName') || ''));
          }}
        />
        <Input
          label='Last Name'
          type='text'
          name='lastName'
          required
          onChange={(e) => {
            form.setValue('name', (form.watch('firstName') || '') + ' ' + e.target.value);
          }}
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
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

      <Input
        label='Address'
        type='text'
        name='address'
        required
        onChange={(e) => {
          const city = form.watch('city') || '';
          const state = form.watch('state') || '';
          const zip = form.watch('zip') || '';
          form.setValue('fullAddress', `${e.target.value}\n ${city}, ${state} ${zip}`);
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
              const address = form.watch('address') || '';
              const state = form.watch('state') || '';
              const zip = form.watch('zip') || '';
              form.setValue('fullAddress', `${address}\n ${e.target.value}, ${state} ${zip}`);
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
            const address = form.watch('address') || '';
            const city = form.watch('city') || '';
            const zip = form.watch('zip') || '';
            form.setValue('fullAddress', `${address}\n ${city}, ${e.target.value} ${zip}`);
          }}
        />
        <div className='col-span-2'>
          <Input
            label='Zip'
            type='number'
            name='zip'
            required
            onChange={(e) => {
              const address = form.watch('address') || '';
              const city = form.watch('city') || '';
              const state = form.watch('state') || '';
              form.setValue('fullAddress', `${address}\n ${city}, ${state} ${e.target.value}`);
            }}
          />
        </div>
      </div>

      <p className='text-center italic'>All fields on this page are required to continue.</p>
    </StepWrapper>
  );
}

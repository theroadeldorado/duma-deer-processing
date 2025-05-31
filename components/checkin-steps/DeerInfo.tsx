import Input from '@/components/Input';
import Select from '@/components/Select';
import StepWrapper from './StepWrapper';
import { StepProps } from './types';
import { useEffect } from 'react';

export default function DeerInfo(props: StepProps) {
  const { form } = props;
  const deerType = form.watch('buckOrDoe');
  const dateHarvested = form.watch('dateHarvested');
  const dateFound = form.watch('dateFound');

  // Custom validation for date relationship
  useEffect(() => {
    if (dateHarvested && dateFound) {
      const harvestedDate = new Date(dateHarvested);
      const foundDate = new Date(dateFound);

      if (foundDate < harvestedDate) {
        form.setError('dateFound', {
          type: 'custom',
          message: 'Date found cannot be before date harvested',
        });
      } else {
        form.clearErrors('dateFound');
      }
    }
  }, [dateHarvested, dateFound, form]);

  return (
    <StepWrapper {...props} title='Deer Information'>
      <div className='space-y-4'>
        <Input label='Confirmation Number' type='text' name='tagNumber' required />

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
          />
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
          />
        </div>

        {deerType === 'Boneless' && (
          <div className='rounded-md border border-blue-200 bg-blue-50 p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg className='h-5 w-5 text-blue-400' viewBox='0 0 20 20' fill='currentColor'>
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-blue-800'>Boneless Processing</h3>
                <div className='mt-2 text-sm text-blue-700'>
                  <p>There is no additional processing cost for boneless deer that&apos;s already deboned.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='grid grid-cols-2 gap-4'>
          <Input
            label='Date Harvested (Shot)'
            type='date'
            name='dateHarvested'
            placeholder='Select date deer was harvested'
            max={new Date().toISOString().split('T')[0]} // Can't be in the future
            required
          />
          <Input
            label='Date Found'
            type='date'
            name='dateFound'
            placeholder='Select date deer was found'
            min={dateHarvested || undefined} // Can't be before harvest date
            max={new Date().toISOString().split('T')[0]} // Can't be in the future
            required
          />
        </div>

        <p className='text-center text-sm italic text-gray-600'>
          Please provide the date information to help us track your deer processing timeline.
        </p>
      </div>
    </StepWrapper>
  );
}

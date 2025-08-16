import Select from '@/components/Select';
import StepWrapper from './StepWrapper';
import { StepProps } from './types';
import Image from 'next/image';
import { useEffect } from 'react';
import Button from '../Button';

export default function CapeHideOptions(props: StepProps) {
  const { form, onNext } = props;
  const capeSelected = form.watch('cape');
  const hideSelected = form.watch('hide');

  // Disable euroMount when shoulder mount is selected
  useEffect(() => {
    if (capeSelected === 'Shoulder mount') {
      form.setValue('euroMount', 'false');
    }
  }, [capeSelected, form]);

  const isEuroMountDisabled = capeSelected === 'Shoulder mount';

  const handleSkipStep = () => {
    // Clear all cape, hide, and euroMount selections
    form.setValue('cape', '');
    form.setValue('hide', '');
    form.setValue('euroMount', 'false');

    // Navigate to next step
    if (onNext) {
      onNext();
    }
  };

  return (
    <StepWrapper {...props} title='Cape & Hide (Optional)'>
      <div className='space-y-6'>
        <div className='grid grid-cols-3 gap-6'>
          <div className='flex flex-col items-center justify-start gap-1'>
            <div className='relative aspect-square w-full overflow-hidden rounded-md'>
              <Image src='/cape.png' className='absolute inset-0 h-full w-full object-cover' width={500} height={300} alt='cape' />
            </div>
            <p className='mb-1 w-full text-center font-bold'>Shoulder Mount Options</p>
            <Select
              className='w-full'
              name='cape'
              options={[
                { value: '', label: 'Select Option' },
                { value: 'Cape for shoulder mount', label: 'Keep Cape - $50' },
                { value: 'Shoulder mount', label: 'Shoulder Mount - $111' },
              ]}
            />
          </div>

          <div className='flex flex-col items-center justify-start gap-1'>
            <div className='relative aspect-square w-full overflow-hidden rounded-md'>
              <Image src='/hide.jpg' className='absolute inset-0 h-full w-full object-cover' width={500} height={300} alt='hide' />
            </div>
            <p className='mb-1 w-full text-center font-bold'>Keep skinned hide</p>
            <Select
              className='w-full'
              name='hide'
              options={[
                { value: '', label: 'Select Option' },
                { value: 'Keep skinned hide', label: 'Additional $15' },
              ]}
            />
          </div>

          <div className={`flex flex-col items-center justify-start gap-1 ${isEuroMountDisabled ? 'pointer-events-none opacity-50' : ''}`}>
            <div className='relative aspect-square w-full overflow-hidden rounded-md'>
              <Image src='/euro-mount.jpg' className='absolute inset-0 h-full w-full object-cover' width={500} height={300} alt='euro-mount' />
            </div>
            <p className='w-full text-center font-bold'>Euro Mount</p>
            <Select
              className='w-full'
              name='euroMount'
              options={[
                { value: 'false', label: 'Select Option' },
                { value: 'Keep head', label: 'Keep Head - Take Today' },
                { value: 'Boiled finished mount', label: 'Boiled Finished Mount - $145' },
                { value: 'Beetles finished mount', label: 'Beetles Finished Mount - $175' },
              ]}
            />
          </div>
        </div>

        {/* Cape selected message */}
        {capeSelected && capeSelected !== '' && (
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
                <h3 className='text-sm font-medium text-blue-800'>Cape Information</h3>
                <div className='mt-2 text-sm text-blue-700'>
                  {capeSelected === 'Cape for shoulder mount' && <p>NOT MOUNTED just the cape for a mounting.</p>}
                  {capeSelected === 'Shoulder mount' && (
                    <p>Full shoulder mount service - includes cape preparation and mounting. You cannot choose euro mount with this option.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hide selected message */}
        {hideSelected && hideSelected !== '' && (
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
                <h3 className='text-sm font-medium text-blue-800'>Hide Information</h3>
                <div className='mt-2 text-sm text-blue-700'>
                  <p>Hide and saved for you, NOT TANNED.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='flex flex-col items-center justify-center gap-6'>
          <Button type='button' onClick={handleSkipStep}>
            None of the above
          </Button>
        </div>
      </div>
    </StepWrapper>
  );
}

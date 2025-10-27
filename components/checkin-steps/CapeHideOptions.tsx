import Select from '@/components/Select';
import StepWrapper from './StepWrapper';
import { StepProps } from './types';
import Image from 'next/image';
import { useEffect } from 'react';

export default function CapeHideOptions(props: StepProps) {
  const { form, onNext } = props;
  const capeSelected = form.watch('cape') || '';
  const hideSelected = form.watch('hide') || '';
  const euroMountSelected = form.watch('euroMount') || 'false';

  // Disable euroMount when shoulder mount is selected
  useEffect(() => {
    if (capeSelected === 'Shoulder mount') {
      form.setValue('euroMount', 'false');
    }
  }, [capeSelected, form]);

  // Clear shoulder mount validation errors when not selected
  useEffect(() => {
    if (capeSelected !== 'Shoulder mount') {
      const fields = ['shoulderMountHeadPosition', 'shoulderMountEarPosition'];
      fields.forEach((field) => form.clearErrors(field as any));
    }
  }, [capeSelected, form]);

  const isEuroMountDisabled = capeSelected === 'Shoulder mount';

  const handleCapeSelect = (value: string) => {
    form.setValue('cape', value);
  };

  const handleHideSelect = (value: string) => {
    form.setValue('hide', value);
  };

  const handleEuroMountSelect = (value: string) => {
    if (!isEuroMountDisabled) {
      form.setValue('euroMount', value);
    }
  };

  const handleSkipStep = () => {
    // Clear all cape, hide, euroMount, and shoulder mount selections
    form.setValue('cape', '');
    form.setValue('hide', '');
    form.setValue('euroMount', 'false');
    form.setValue('shoulderMountHeadPosition', '');
    form.setValue('shoulderMountEarPosition', '');
    form.setValue('shoulderMountSpecialInstructions', '');

    // Navigate to next step
    if (onNext) {
      onNext();
    }
  };

  return (
    <StepWrapper {...props} title='Cape & Hide (Optional)'>
      <div className='space-y-6'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          {/* Shoulder Mount Options */}
          <div className='flex flex-col items-center gap-3'>
            <div className='relative aspect-square w-full overflow-hidden rounded-md'>
              <Image src='/mount.jpg' className='absolute inset-0 h-full w-full object-cover' width={500} height={300} alt='mount' />
            </div>
            <p className='w-full text-center text-lg font-bold'>Shoulder Mount Options</p>
            <div className='w-full space-y-2'>
              <button
                type='button'
                onClick={() => handleCapeSelect('')}
                className={`group relative w-full rounded-lg border-2 p-3 text-left transition-all duration-200 hover:shadow-md ${
                  capeSelected === '' ? 'border-[#E28532] bg-[#E28532]/10 shadow-md' : 'border-gray-300 bg-white hover:border-[#E28532]/50'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div className='text-sm font-medium text-gray-900'>None</div>
                  <div
                    className={`h-4 w-4 shrink-0 rounded-full border-2 transition-all ${
                      capeSelected === '' ? 'border-[#E28532] bg-[#E28532]' : 'border-gray-300 group-hover:border-[#E28532]/50'
                    }`}
                  >
                    {capeSelected === '' && <div className='h-full w-full scale-50 rounded-full bg-white'></div>}
                  </div>
                </div>
              </button>
              <button
                type='button'
                onClick={() => handleCapeSelect('Cape for shoulder mount')}
                className={`group relative w-full rounded-lg border-2 p-3 text-left transition-all duration-200 hover:shadow-md ${
                  capeSelected === 'Cape for shoulder mount'
                    ? 'border-[#E28532] bg-[#E28532]/10 shadow-md'
                    : 'border-gray-300 bg-white hover:border-[#E28532]/50'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='text-sm font-semibold text-gray-900'>Keep Cape</div>
                    <div className='text-xs text-gray-600'>$50 (Take Today)</div>
                  </div>
                  <div
                    className={`h-4 w-4 shrink-0 rounded-full border-2 transition-all ${
                      capeSelected === 'Cape for shoulder mount' ? 'border-[#E28532] bg-[#E28532]' : 'border-gray-300 group-hover:border-[#E28532]/50'
                    }`}
                  >
                    {capeSelected === 'Cape for shoulder mount' && <div className='h-full w-full scale-50 rounded-full bg-white'></div>}
                  </div>
                </div>
              </button>
              <button
                type='button'
                onClick={() => handleCapeSelect('Shoulder mount')}
                className={`group relative w-full rounded-lg border-2 p-3 text-left transition-all duration-200 hover:shadow-md ${
                  capeSelected === 'Shoulder mount'
                    ? 'border-[#E28532] bg-[#E28532]/10 shadow-md'
                    : 'border-gray-300 bg-white hover:border-[#E28532]/50'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='text-sm font-semibold text-gray-900'>DDP Shoulder Mount</div>
                    <div className='text-xs text-gray-600'>$850 (Leave Here)</div>
                  </div>
                  <div
                    className={`h-4 w-4 shrink-0 rounded-full border-2 transition-all ${
                      capeSelected === 'Shoulder mount' ? 'border-[#E28532] bg-[#E28532]' : 'border-gray-300 group-hover:border-[#E28532]/50'
                    }`}
                  >
                    {capeSelected === 'Shoulder mount' && <div className='h-full w-full scale-50 rounded-full bg-white'></div>}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Hide Options */}
          <div className='flex flex-col items-center gap-3'>
            <div className='relative aspect-square w-full overflow-hidden rounded-md'>
              <Image src='/hide.jpg' className='absolute inset-0 h-full w-full object-cover' width={500} height={300} alt='hide' />
            </div>
            <p className='w-full text-center text-lg font-bold'>Hide Options</p>
            <div className='w-full space-y-2'>
              <button
                type='button'
                onClick={() => handleHideSelect('')}
                className={`group relative w-full rounded-lg border-2 p-3 text-left transition-all duration-200 hover:shadow-md ${
                  hideSelected === '' ? 'border-[#E28532] bg-[#E28532]/10 shadow-md' : 'border-gray-300 bg-white hover:border-[#E28532]/50'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div className='text-sm font-medium text-gray-900'>None</div>
                  <div
                    className={`h-4 w-4 shrink-0 rounded-full border-2 transition-all ${
                      hideSelected === '' ? 'border-[#E28532] bg-[#E28532]' : 'border-gray-300 group-hover:border-[#E28532]/50'
                    }`}
                  >
                    {hideSelected === '' && <div className='h-full w-full scale-50 rounded-full bg-white'></div>}
                  </div>
                </div>
              </button>
              <button
                type='button'
                onClick={() => handleHideSelect('Save Hide')}
                className={`group relative w-full rounded-lg border-2 p-3 text-left transition-all duration-200 hover:shadow-md ${
                  hideSelected === 'Save Hide' ? 'border-[#E28532] bg-[#E28532]/10 shadow-md' : 'border-gray-300 bg-white hover:border-[#E28532]/50'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='text-sm font-semibold text-gray-900'>Save Hide</div>
                    <div className='text-xs text-gray-600'>$15 (Take Today)</div>
                  </div>
                  <div
                    className={`h-4 w-4 shrink-0 rounded-full border-2 transition-all ${
                      hideSelected === 'Save Hide' ? 'border-[#E28532] bg-[#E28532]' : 'border-gray-300 group-hover:border-[#E28532]/50'
                    }`}
                  >
                    {hideSelected === 'Save Hide' && <div className='h-full w-full scale-50 rounded-full bg-white'></div>}
                  </div>
                </div>
              </button>
              <button
                type='button'
                onClick={() => handleHideSelect('Tanned Hair on')}
                className={`group relative w-full rounded-lg border-2 p-3 text-left transition-all duration-200 hover:shadow-md ${
                  hideSelected === 'Tanned Hair on'
                    ? 'border-[#E28532] bg-[#E28532]/10 shadow-md'
                    : 'border-gray-300 bg-white hover:border-[#E28532]/50'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='text-sm font-semibold text-gray-900'>Tanned Hair on</div>
                    <div className='text-xs text-gray-600'>$200</div>
                  </div>
                  <div
                    className={`h-4 w-4 shrink-0 rounded-full border-2 transition-all ${
                      hideSelected === 'Tanned Hair on' ? 'border-[#E28532] bg-[#E28532]' : 'border-gray-300 group-hover:border-[#E28532]/50'
                    }`}
                  >
                    {hideSelected === 'Tanned Hair on' && <div className='h-full w-full scale-50 rounded-full bg-white'></div>}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Euro Mount Options */}
          <div className={`flex flex-col items-center gap-3 ${isEuroMountDisabled ? 'pointer-events-none opacity-50' : ''}`}>
            <div className='relative aspect-square w-full overflow-hidden rounded-md'>
              <Image src='/euro-mount.jpg' className='absolute inset-0 h-full w-full object-cover' width={500} height={300} alt='euro-mount' />
            </div>
            <p className='w-full text-center text-lg font-bold'>Euro Mount</p>
            <div className='w-full space-y-2'>
              <button
                type='button'
                onClick={() => handleEuroMountSelect('false')}
                disabled={isEuroMountDisabled}
                className={`group relative w-full rounded-lg border-2 p-3 text-left transition-all duration-200 hover:shadow-md ${
                  euroMountSelected === 'false' ? 'border-[#E28532] bg-[#E28532]/10 shadow-md' : 'border-gray-300 bg-white hover:border-[#E28532]/50'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div className='text-sm font-medium text-gray-900'>None</div>
                  <div
                    className={`h-4 w-4 shrink-0 rounded-full border-2 transition-all ${
                      euroMountSelected === 'false' ? 'border-[#E28532] bg-[#E28532]' : 'border-gray-300 group-hover:border-[#E28532]/50'
                    }`}
                  >
                    {euroMountSelected === 'false' && <div className='h-full w-full scale-50 rounded-full bg-white'></div>}
                  </div>
                </div>
              </button>
              <button
                type='button'
                onClick={() => handleEuroMountSelect('Keep head')}
                disabled={isEuroMountDisabled}
                className={`group relative w-full rounded-lg border-2 p-3 text-left transition-all duration-200 hover:shadow-md ${
                  euroMountSelected === 'Keep head'
                    ? 'border-[#E28532] bg-[#E28532]/10 shadow-md'
                    : 'border-gray-300 bg-white hover:border-[#E28532]/50'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='text-sm font-semibold text-gray-900'>Keep Head</div>
                    <div className='text-xs text-gray-600'>(Take Today)</div>
                  </div>
                  <div
                    className={`h-4 w-4 shrink-0 rounded-full border-2 transition-all ${
                      euroMountSelected === 'Keep head' ? 'border-[#E28532] bg-[#E28532]' : 'border-gray-300 group-hover:border-[#E28532]/50'
                    }`}
                  >
                    {euroMountSelected === 'Keep head' && <div className='h-full w-full scale-50 rounded-full bg-white'></div>}
                  </div>
                </div>
              </button>
              <button
                type='button'
                onClick={() => handleEuroMountSelect('Boiled finished mount')}
                disabled={isEuroMountDisabled}
                className={`group relative w-full rounded-lg border-2 p-3 text-left transition-all duration-200 hover:shadow-md ${
                  euroMountSelected === 'Boiled finished mount'
                    ? 'border-[#E28532] bg-[#E28532]/10 shadow-md'
                    : 'border-gray-300 bg-white hover:border-[#E28532]/50'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='text-sm font-semibold text-gray-900'>Boiled Finished Mount</div>
                    <div className='text-xs text-gray-600'>$145 (Leave Here)</div>
                  </div>
                  <div
                    className={`h-4 w-4 shrink-0 rounded-full border-2 transition-all ${
                      euroMountSelected === 'Boiled finished mount'
                        ? 'border-[#E28532] bg-[#E28532]'
                        : 'border-gray-300 group-hover:border-[#E28532]/50'
                    }`}
                  >
                    {euroMountSelected === 'Boiled finished mount' && <div className='h-full w-full scale-50 rounded-full bg-white'></div>}
                  </div>
                </div>
              </button>
              <button
                type='button'
                onClick={() => handleEuroMountSelect('Beetles finished mount')}
                disabled={isEuroMountDisabled}
                className={`group relative w-full rounded-lg border-2 p-3 text-left transition-all duration-200 hover:shadow-md ${
                  euroMountSelected === 'Beetles finished mount'
                    ? 'border-[#E28532] bg-[#E28532]/10 shadow-md'
                    : 'border-gray-300 bg-white hover:border-[#E28532]/50'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='text-sm font-semibold text-gray-900'>Beetles Finished Mount</div>
                    <div className='text-xs text-gray-600'>$175 (Leave Here)</div>
                  </div>
                  <div
                    className={`h-4 w-4 shrink-0 rounded-full border-2 transition-all ${
                      euroMountSelected === 'Beetles finished mount'
                        ? 'border-[#E28532] bg-[#E28532]'
                        : 'border-gray-300 group-hover:border-[#E28532]/50'
                    }`}
                  >
                    {euroMountSelected === 'Beetles finished mount' && <div className='h-full w-full scale-50 rounded-full bg-white'></div>}
                  </div>
                </div>
              </button>
            </div>
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

        {/* Shoulder Mount Pose Options */}
        {capeSelected === 'Shoulder mount' && (
          <div className='border-green-200 bg-green-50 space-y-4 rounded-md border p-4'>
            <h3 className='text-green-800 text-lg font-medium'>Shoulder Mount Pose Details</h3>
            <p className='text-green-700 text-sm'>Please provide details on how you&apos;d like your shoulder mount posed.</p>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>Head position - deer faces from the wall *</label>
                <Select
                  className='w-full'
                  name='shoulderMountHeadPosition'
                  required
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

              <div className='hidden'>
                <label className='mb-1 block text-sm font-medium text-gray-700'>Ear Position *</label>
                <Select
                  className='w-full'
                  name='shoulderMountEarPosition'
                  required
                  options={[
                    { value: '', label: 'Select Position' },
                    { value: 'Alert', label: 'Alert/Forward' },
                    { value: 'Relaxed', label: 'Relaxed/Natural' },
                    { value: 'Back', label: 'Laid Back' },
                  ]}
                />
              </div>
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Special Instructions</label>
              <textarea
                {...form.register('shoulderMountSpecialInstructions')}
                className='w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue'
                rows={3}
                placeholder='Any special requests or specific pose instructions...'
              />
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
                {hideSelected === 'Save Hide' && (
                  <>
                    <h3 className='text-sm font-medium text-blue-800'>Hide Information</h3>
                    <div className='mt-2 text-sm text-blue-700'>
                      <p>Hide saved for you, NOT TANNED and you must take it TODAY.</p>
                    </div>
                  </>
                )}
                {hideSelected === 'Tanned Hair on' && (
                  <>
                    <h3 className='text-sm font-medium text-blue-800'>Expectations</h3>
                    <div className='mt-2 text-sm text-blue-700'>
                      <p>
                        These are normally prepared outside of deer season. We always try to have them done sooner than later, but our plan is to have
                        everything completed by September. Also, through the tanning process the hide could get holes that it did not previously have.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </StepWrapper>
  );
}

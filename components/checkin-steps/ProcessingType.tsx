import StepWrapper from './StepWrapper';
import { StepProps } from './types';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';

export default function ProcessingType(props: StepProps) {
  const form = useFormContext();

  const processingOptions = [
    {
      value: 'Skinned, Cut, Ground, Vacuum packed',
      label: 'Skinned, Cut, Ground, Vacuum packed',
      description: '$110 - Full processing service',
    },
    {
      value: 'Boneless',
      label: 'Boneless',
      description: '100% deboned already - No cost',
    },
    {
      value: 'Donation',
      label: 'Donation',
      description: '$0 - Donated deer processing',
    },
  ];

  const handleOptionSelect = (value: string) => {
    form.setValue('skinnedOrBoneless', value);
  };

  const selectedValue = form.watch('skinnedOrBoneless') || 'Skinned, Cut, Ground, Vacuum packed';

  return (
    <StepWrapper {...props} title='Processing Type'>
      <div className='flex flex-col items-center justify-center gap-6'>
        <div className='w-full'>
          <p className='mb-4 text-center text-lg font-bold'>Choose Your Processing Type</p>
          <div className='grid gap-3'>
            {processingOptions.map((option) => (
              <button
                key={option.value}
                type='button'
                onClick={() => handleOptionSelect(option.value)}
                className={`group relative w-full rounded-lg border-2 p-4 text-left transition-all duration-200 hover:shadow-md ${
                  selectedValue === option.value ? 'border-[#E28532] bg-[#E28532]/10 shadow-md' : 'border-gray-300 bg-white hover:border-[#E28532]/50'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='text-lg font-semibold text-gray-900'>{option.label}</div>
                    <div className='text-sm text-gray-600'>{option.description}</div>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border-2 transition-all ${
                      selectedValue === option.value ? 'border-[#E28532] bg-[#E28532]' : 'border-gray-300 group-hover:border-[#E28532]/50'
                    }`}
                  >
                    {selectedValue === option.value && <div className='h-full w-full scale-50 rounded-full bg-white'></div>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedValue === 'Boneless' && (
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
                <h3 className='text-sm font-medium text-blue-800'>Boneless Processing Information</h3>
                <div className='mt-2 text-sm text-blue-700'>
                  <p>
                    Must select &quot;Skinned&quot; even if already skinned or quartered.
                    <br />
                    There is no cost if your deer is 100% deboned. We will need to weigh your deer before processing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StepWrapper>
  );
}

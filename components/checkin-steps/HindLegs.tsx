import Textarea from '@/components/Textarea';
import StepWrapper from './StepWrapper';
import { StepProps } from './types';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';

export default function HindLegs(props: StepProps) {
  const form = useFormContext();

  const hindLegOptions = [
    { value: 'Grind', label: 'Grind', description: 'Ground with your deer burger' },
    { value: 'Steaks', label: 'Steaks', description: 'approx. 4-6 steaks per leg' },
    { value: 'Whole Muscle Jerky', label: 'Whole Muscle Jerky', description: 'Jerky - $35' },
  ];

  const jerkyFlavorOptions = [
    { value: 'Appalachian Mild', label: 'Appalachian Mild', description: 'Classic mild flavor' },
    { value: 'Hillbilly Hot', label: 'Hillbilly Hot', description: 'Spicy hot flavor' },
    { value: 'Teriyaki', label: 'Teriyaki', description: 'Sweet teriyaki flavor' },
  ];

  const tenderizedOptions = [
    { value: 'false', label: 'No', description: 'Standard steaks' },
    { value: 'true', label: 'Yes', description: 'Tenderized cubed steaks - $5' },
  ];

  const hindLeg1 = form.watch('hindLegPreference1') || 'Grind';
  const hindLeg2 = form.watch('hindLegPreference2') || 'Grind';
  const tenderized = form.watch('tenderizedCubedSteaks') || 'false';
  const jerky1Flavor = form.watch('hindLegJerky1Flavor');
  const jerky2Flavor = form.watch('hindLegJerky2Flavor');

  // Check if steaks is selected for either leg
  const showTenderizedOption = hindLeg1 === 'Steaks' || hindLeg2 === 'Steaks';

  const handleHindLeg1Select = (value: string) => {
    form.setValue('hindLegPreference1', value);
    if (value === 'Whole Muscle Jerky') {
      // Default to Mild when jerky is selected
      form.setValue('hindLegJerky1Flavor', 'Mild');
    } else {
      // Clear jerky flavor when jerky is not selected
      form.setValue('hindLegJerky1Flavor', '');
    }
    // Reset tenderized option if no steaks selected
    if (value !== 'Steaks' && hindLeg2 !== 'Steaks') {
      form.setValue('tenderizedCubedSteaks', 'false');
    }
  };

  const handleHindLeg2Select = (value: string) => {
    form.setValue('hindLegPreference2', value);
    if (value === 'Whole Muscle Jerky') {
      // Default to Mild when jerky is selected
      form.setValue('hindLegJerky2Flavor', 'Mild');
    } else {
      // Clear jerky flavor when jerky is not selected
      form.setValue('hindLegJerky2Flavor', '');
    }
    // Reset tenderized option if no steaks selected
    if (value !== 'Steaks' && hindLeg1 !== 'Steaks') {
      form.setValue('tenderizedCubedSteaks', 'false');
    }
  };

  const handleJerky1FlavorSelect = (value: string) => {
    form.setValue('hindLegJerky1Flavor', value);
  };

  const handleJerky2FlavorSelect = (value: string) => {
    form.setValue('hindLegJerky2Flavor', value);
  };

  const handleTenderizedSelect = (value: string) => {
    form.setValue('tenderizedCubedSteaks', value);
  };

  return (
    <StepWrapper {...props} title='Hind Legs'>
      <div className='flex flex-col items-center justify-center gap-6'>
        <div className='mb-6 aspect-square w-48 overflow-hidden rounded-full border-[5px] border-dashed border-[#E28532] bg-tan-1'>
          <Image
            src='/hind.svg'
            className='h-full w-full -translate-x-20 -translate-y-10 scale-150 object-cover'
            width={500}
            height={300}
            alt='hind legs'
          />
        </div>

        <div className='grid w-full grid-cols-1 gap-6 md:grid-cols-2'>
          {/* Hind Leg 1 */}
          <div className='w-full'>
            <p className='mb-4 text-center text-lg font-bold'>Hind Leg (1) Preference</p>
            <div className='grid grid-cols-2 gap-2'>
              {hindLegOptions.map((option) => (
                <button
                  key={option.value}
                  type='button'
                  onClick={() => handleHindLeg1Select(option.value)}
                  className={`group relative w-full rounded-lg border-2 p-3 text-left transition-all duration-200 hover:shadow-md ${
                    hindLeg1 === option.value ? 'border-[#E28532] bg-[#E28532]/10 shadow-md' : 'border-gray-300 bg-white hover:border-[#E28532]/50'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='text-sm font-semibold text-gray-900'>{option.label}</div>
                      <div className='text-xs text-gray-600'>{option.description}</div>
                    </div>
                    <div
                      className={`h-4 w-4 rounded-full border-2 transition-all ${
                        hindLeg1 === option.value ? 'border-[#E28532] bg-[#E28532]' : 'border-gray-300 group-hover:border-[#E28532]/50'
                      }`}
                    >
                      {hindLeg1 === option.value && <div className='h-full w-full scale-50 rounded-full bg-white'></div>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Hind Leg 2 */}
          <div className='w-full'>
            <p className='mb-4 text-center text-lg font-bold'>Hind Leg (2) Preference</p>
            <div className='grid grid-cols-2 gap-2'>
              {hindLegOptions.map((option) => (
                <button
                  key={option.value}
                  type='button'
                  onClick={() => handleHindLeg2Select(option.value)}
                  className={`group relative w-full rounded-lg border-2 p-3 text-left transition-all duration-200 hover:shadow-md ${
                    hindLeg2 === option.value ? 'border-[#E28532] bg-[#E28532]/10 shadow-md' : 'border-gray-300 bg-white hover:border-[#E28532]/50'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='text-sm font-semibold text-gray-900'>{option.label}</div>
                      <div className='text-xs text-gray-600'>{option.description}</div>
                    </div>
                    <div
                      className={`h-4 w-4 rounded-full border-2 transition-all ${
                        hindLeg2 === option.value ? 'border-[#E28532] bg-[#E28532]' : 'border-gray-300 group-hover:border-[#E28532]/50'
                      }`}
                    >
                      {hindLeg2 === option.value && <div className='h-full w-full scale-50 rounded-full bg-white'></div>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className='grid w-full grid-cols-1 gap-6 md:grid-cols-2'>
          {/* Tenderized Cubed Steaks - Only show if steaks selected */}
          {showTenderizedOption && (
            <div
              className={`w-full md:row-start-1 ${
                hindLeg1 === 'Steaks' && hindLeg2 === 'Steaks'
                  ? 'md:col-span-full'
                  : hindLeg1 === 'Steaks'
                  ? 'md:col-start-1'
                  : hindLeg2 === 'Steaks'
                  ? 'md:col-start-2'
                  : ''
              }`}
            >
              <p className='mb-4 text-center text-lg font-bold'>Tenderized Cubed Steaks</p>
              <div className='grid grid-cols-2 gap-2'>
                {tenderizedOptions.map((option) => (
                  <button
                    key={option.value}
                    type='button'
                    onClick={() => handleTenderizedSelect(option.value)}
                    className={`group relative w-full rounded-lg border-2 p-3 text-left transition-all duration-200 hover:shadow-md ${
                      tenderized === option.value
                        ? 'border-[#E28532] bg-[#E28532]/10 shadow-md'
                        : 'border-gray-300 bg-white hover:border-[#E28532]/50'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <div>
                        <div className='text-sm font-semibold text-gray-900'>{option.label}</div>
                        <div className='text-xs text-gray-600'>{option.description}</div>
                      </div>
                      <div
                        className={`h-4 w-4 rounded-full border-2 transition-all ${
                          tenderized === option.value ? 'border-[#E28532] bg-[#E28532]' : 'border-gray-300 group-hover:border-[#E28532]/50'
                        }`}
                      >
                        {tenderized === option.value && <div className='h-full w-full scale-50 rounded-full bg-white'></div>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Jerky Flavor Options */}
          {hindLeg1 === 'Whole Muscle Jerky' && (
            <div className='w-full'>
              <p className='mb-4 text-center text-lg font-bold'>Hind Leg (1) Jerky Flavor</p>
              <div className='grid grid-cols-2 gap-2'>
                {jerkyFlavorOptions.map((option) => (
                  <button
                    key={option.value}
                    type='button'
                    onClick={() => handleJerky1FlavorSelect(option.value)}
                    className={`group relative w-full rounded-lg border-2 p-3 text-left transition-all duration-200 hover:shadow-md ${
                      (jerky1Flavor || '') === option.value
                        ? 'border-[#E28532] bg-[#E28532]/10 shadow-md'
                        : 'border-gray-300 bg-white hover:border-[#E28532]/50'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <div>
                        <div className='text-sm font-semibold text-gray-900'>{option.label}</div>
                        <div className='text-xs text-gray-600'>{option.description}</div>
                      </div>
                      <div
                        className={`h-4 w-4 rounded-full border-2 transition-all ${
                          (jerky1Flavor || '') === option.value ? 'border-[#E28532] bg-[#E28532]' : 'border-gray-300 group-hover:border-[#E28532]/50'
                        }`}
                      >
                        {(jerky1Flavor || '') === option.value && <div className='h-full w-full scale-50 rounded-full bg-white'></div>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {hindLeg2 === 'Whole Muscle Jerky' && (
            <div className='w-full md:col-start-2'>
              <p className='mb-4 text-center text-lg font-bold'>Hind Leg (2) Jerky Flavor</p>
              <div className='grid grid-cols-2 gap-2'>
                {jerkyFlavorOptions.map((option) => (
                  <button
                    key={option.value}
                    type='button'
                    onClick={() => handleJerky2FlavorSelect(option.value)}
                    className={`group relative w-full rounded-lg border-2 p-3 text-left transition-all duration-200 hover:shadow-md ${
                      (jerky2Flavor || '') === option.value
                        ? 'border-[#E28532] bg-[#E28532]/10 shadow-md'
                        : 'border-gray-300 bg-white hover:border-[#E28532]/50'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <div>
                        <div className='text-sm font-semibold text-gray-900'>{option.label}</div>
                        <div className='text-xs text-gray-600'>{option.description}</div>
                      </div>
                      <div
                        className={`h-4 w-4 rounded-full border-2 transition-all ${
                          (jerky2Flavor || '') === option.value ? 'border-[#E28532] bg-[#E28532]' : 'border-gray-300 group-hover:border-[#E28532]/50'
                        }`}
                      >
                        {(jerky2Flavor || '') === option.value && <div className='h-full w-full scale-50 rounded-full bg-white'></div>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Jerky Information - Show if either leg is jerky */}
        {(hindLeg1 === 'Whole Muscle Jerky' || hindLeg2 === 'Whole Muscle Jerky') && (
          <div className='w-full rounded-md border border-blue-200 bg-blue-50 p-4'>
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
                <h3 className='text-sm font-medium text-blue-800'>Jerky Information</h3>
                <div className='mt-2 text-sm text-blue-700'>
                  <p>Jerky weight per leg 5lb. Cooking loss on whole muscle jerky 65%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='hidden w-full'>
          <Textarea rows={2} name='hindLegNotes' label='Special Instructions' />
        </div>
      </div>
    </StepWrapper>
  );
}

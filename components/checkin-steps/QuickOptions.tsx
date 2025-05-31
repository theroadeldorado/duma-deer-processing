import StepWrapper from './StepWrapper';
import { StepProps } from './types';
import { useFormContext } from 'react-hook-form';

export default function QuickOptions(props: StepProps) {
  const form = useFormContext();

  const quickOptions = [
    {
      value: 'Customize Cuts and Specialty Meats',
      label: 'Customize Cuts and Specialty Meats',
      description: 'Choose specific cuts and processing options',
    },
    {
      value: 'Grind Everything - All Burger',
      label: 'Grind Everything - All Burger',
      description: 'Simple option - everything ground into burger',
    },
  ];

  const handleOptionSelect = (value: string) => {
    form.setValue('quickOption', value);

    if (value === 'Grind Everything - All Burger') {
      // Set all processing options to grind
      form.setValue('backStrapsPreference', 'Grind');
      form.setValue('hindLegPreference1', 'Grind');
      form.setValue('hindLegPreference2', 'Grind');
      form.setValue('tenderizedCubedSteaks', 'false');
      form.setValue('hindLegJerky1Flavor', '');
      form.setValue('hindLegJerky2Flavor', '');
      form.setValue('roastsPreference', 'Grind');
      form.setValue('groundVenison', 'Remainder of meat');
      form.setValue('groundVenisonAmount', 'Remainder of meat');

      // Clear all specialty meat selections
      form.setValue('trailBolognaRegular', '0');
      form.setValue('trailBolognaCheddarCheese', '0');
      form.setValue('trailBolognaHotPepperJackCheese', '0');
      form.setValue('garlicRingBologna', '0');
      form.setValue('summerSausageMild', '0');
      form.setValue('summerSausageHot', '0');
      form.setValue('smokedKielbasaSausage', '0');
      form.setValue('italianSausageLinksMild', '0');
      form.setValue('italianSausageLinksHot', '0');
      form.setValue('countryBreakfastSausage', '0');
      form.setValue('babyLinksCountry', '0');
      form.setValue('babyLinksMaple', '0');
      form.setValue('snackSticksRegular', '0');
      form.setValue('snackSticksCheddarCheese', '0');
      form.setValue('snackSticksHotPepperJackCheese', '0');
      form.setValue('snackSticksHoneyBBQ', '0');
      form.setValue('hotDogsRegular', '0');
      form.setValue('hotDogsCheddarCheese', '0');
      form.setValue('hotDogsHotPepperJackCheese', '0');
      form.setValue('jerkyRestructuredHot', '0');
      form.setValue('jerkyRestructuredMild', '0');
      form.setValue('jerkyRestructuredTeriyaki', '0');
    }
  };

  const selectedValue = form.watch('quickOption') || 'Customize Cuts and Specialty Meats';

  return (
    <StepWrapper {...props} title='Quick Options'>
      <div className='flex flex-col items-center justify-center gap-6'>
        <div className='w-full'>
          <p className='mb-4 text-center text-lg font-bold'>How would you like to process your deer?</p>
          <div className='grid grid-cols-2 gap-4'>
            {quickOptions.map((option) => (
              <button
                key={option.value}
                type='button'
                onClick={() => handleOptionSelect(option.value)}
                className={`group relative w-full rounded-lg border-2 p-6 text-left transition-all duration-200 hover:shadow-md ${
                  selectedValue === option.value ? 'border-[#E28532] bg-[#E28532]/10 shadow-md' : 'border-gray-300 bg-white hover:border-[#E28532]/50'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='text-xl font-semibold text-gray-900'>{option.label}</div>
                    <div className='mt-1 text-sm text-gray-600'>{option.description}</div>
                  </div>
                  <div
                    className={`h-6 w-6 rounded-full border-2 transition-all ${
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

        {selectedValue === 'Grind Everything - All Burger' && (
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
                <h3 className='text-sm font-medium text-blue-800'>All Burger Option</h3>
                <div className='mt-2 text-sm text-blue-700'>
                  <p>Your entire deer will be ground into burger meat. No steaks, roasts, or specialty meats will be processed.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StepWrapper>
  );
}

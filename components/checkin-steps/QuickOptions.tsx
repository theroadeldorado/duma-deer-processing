import StepWrapper from './StepWrapper';
import { StepProps } from './types';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';

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

  const groundVenisonOptions = [
    { value: 'Plain', label: 'Plain', description: 'Pure ground venison' },
    { value: 'Add Beef Trim', label: 'Add Beef Trim', description: '$5 - Mixed with beef' },
    { value: 'Add Pork Trim', label: 'Add Pork Trim', description: '$5 - Mixed with pork' },
    { value: 'Add Beef & Pork Trim', label: 'Add Beef & Pork Trim', description: '$10 - Mixed with both' },
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
      form.setValue('roast', 'Grind');
      form.setValue('groundVenison', 'Plain'); // Set default ground venison option
      form.setValue('groundVenisonAmount', 'Remainder');

      // Clear all specialty meat selections
      form.setValue('trailBolognaRegular', 'false');
      form.setValue('trailBolognaCheddarCheese', 'false');
      form.setValue('trailBolognaHotPepperJackCheese', 'false');
      form.setValue('garlicRingBologna', 'false');
      form.setValue('summerSausageMild', 'false');
      form.setValue('summerSausageHot', 'false');
      form.setValue('smokedKielbasaSausage', 'false');
      form.setValue('italianSausageLinksMild', 'false');
      form.setValue('italianSausageLinksHot', 'false');
      form.setValue('countryBreakfastSausage', 'false');
      form.setValue('babyLinksCountry', 'false');
      form.setValue('babyLinksMaple', 'false');
      form.setValue('snackSticksRegular', 'false');
      form.setValue('snackSticksCheddarCheese', 'false');
      form.setValue('snackSticksHotPepperJackCheese', 'false');
      form.setValue('snackSticksHoneyBBQ', 'false');
      form.setValue('hotDogsRegular', 'false');
      form.setValue('hotDogsCheddarCheese', 'false');
      form.setValue('hotDogsHotPepperJackCheese', 'false');
      form.setValue('jerkyRestructuredHot', 'false');
      form.setValue('jerkyRestructuredMild', 'false');
      form.setValue('jerkyRestructuredTeriyaki', 'false');
    } else {
      form.setValue('groundVenison', 'Plain');
      form.setValue('groundVenisonAmount', 'Remainder');
    }
  };

  const handleGroundVenisonSelect = (value: string) => {
    form.setValue('groundVenison', value);
  };

  const selectedValue = form.watch('quickOption') || 'Customize Cuts and Specialty Meats';
  const groundVenisonSelected = form.watch('groundVenison');

  // Initialize ground venison default when component mounts
  useEffect(() => {
    const currentGroundVenison = form.getValues('groundVenison');
    if (currentGroundVenison === undefined || currentGroundVenison === null) {
      form.setValue('groundVenison', 'Plain');
    }
  }, [form]);

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
          <div className='w-full space-y-6'>
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

            {/* Ground Venison Options */}
            <div className='flex flex-col gap-3'>
              <h4 className='text-lg font-semibold text-gray-800'>Ground Venison Options</h4>
              <div className='grid grid-cols-2 gap-2 md:grid-cols-4'>
                {groundVenisonOptions.map((option) => (
                  <button
                    key={option.value}
                    type='button'
                    onClick={() => handleGroundVenisonSelect(option.value)}
                    className={`group relative w-full rounded-lg border-2 p-3 text-left transition-all duration-200 hover:shadow-md ${
                      groundVenisonSelected === option.value
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
                          groundVenisonSelected === option.value ? 'border-[#E28532] bg-[#E28532]' : 'border-gray-300 group-hover:border-[#E28532]/50'
                        }`}
                      >
                        {groundVenisonSelected === option.value && <div className='h-full w-full scale-50 rounded-full bg-white'></div>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </StepWrapper>
  );
}

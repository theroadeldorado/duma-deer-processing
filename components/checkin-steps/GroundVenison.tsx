import StepWrapper from './StepWrapper';
import { StepProps } from './types';
import Image from 'next/image';
import { useEffect } from 'react';

export default function GroundVenison(props: StepProps) {
  const { form } = props;
  const groundVenisonAmountSelected = form.watch('groundVenisonAmount');
  const groundVenisonSelected = form.watch('groundVenison');

  // Initialize default values
  useEffect(() => {
    const currentGroundVenison = form.getValues('groundVenison');
    const currentGroundVenisonAmount = form.getValues('groundVenisonAmount');

    // Set defaults if fields are undefined or null
    if (currentGroundVenison === undefined || currentGroundVenison === null) {
      form.setValue('groundVenison', 'Plain');
    }
    if (currentGroundVenisonAmount === undefined || currentGroundVenisonAmount === null) {
      form.setValue('groundVenisonAmount', 'Remainder');
    }
  }, [form]);

  const groundVenisonOptions = [
    { value: 'Plain', label: 'Plain', description: 'Pure ground venison' },
    { value: 'Add Beef Trim', label: 'Add Beef Trim', description: '$5 - Mixed with beef' },
    { value: 'Add Pork Trim', label: 'Add Pork Trim', description: '$5 - Mixed with pork' },
    { value: 'Add Beef & Pork Trim', label: 'Add Beef & Pork Trim', description: '$10 - Mixed with both' },
  ];

  const groundVenisonAmountOptions = [
    { value: 'Remainder', label: 'Remainder of meat', description: 'Ground from remaining meat after cuts' },
    { value: 'None - All specialty meat', label: 'None - All specialty meat', description: 'All meat becomes specialty products' },
  ];

  const handleGroundVenisonSelect = (value: string) => {
    form.setValue('groundVenison', value);
  };

  const handleGroundVenisonAmountSelect = (value: string) => {
    form.setValue('groundVenisonAmount', value);
  };

  return (
    <StepWrapper {...props} title='Burger Options'>
      <div className='space-y-8'>
        {/* Ground Venison Section */}
        <div className='grid grid-cols-2 gap-6'>
          <h3 className='col-span-2 text-center text-display-xs font-bold'>Ground Venison</h3>
          <div className='relative min-h-[220px] overflow-hidden rounded-md'>
            <Image
              src='/ground_venison.jpg'
              className='absolute inset-0 h-full w-full object-cover'
              width={500}
              height={300}
              alt='Ground Venison'
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className='flex flex-col gap-6'>
            {/* Ground Venison Options */}
            <div className='flex flex-col gap-3'>
              <h4 className='text-lg font-semibold text-gray-800'>Ground Venison Options</h4>
              <div className='grid grid-cols-2 gap-2'>
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

            {/* Ground Venison Amount */}
            <div className='flex flex-col gap-3'>
              <h4 className='text-lg font-semibold text-gray-800'>Ground Venison Amount</h4>
              <div className='grid grid-cols-1 gap-2'>
                {groundVenisonAmountOptions.map((option) => (
                  <button
                    key={option.value}
                    type='button'
                    onClick={() => handleGroundVenisonAmountSelect(option.value)}
                    className={`group relative w-full rounded-lg border-2 p-3 text-left transition-all duration-200 hover:shadow-md ${
                      groundVenisonAmountSelected === option.value
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
                          groundVenisonAmountSelected === option.value
                            ? 'border-[#E28532] bg-[#E28532]'
                            : 'border-gray-300 group-hover:border-[#E28532]/50'
                        }`}
                      >
                        {groundVenisonAmountSelected === option.value && <div className='h-full w-full scale-50 rounded-full bg-white'></div>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Logic-based alerts */}
        {groundVenisonAmountSelected === 'Remainder' && (
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
                <h3 className='text-sm font-medium text-blue-800'>Remainder of Meat</h3>
                <div className='mt-2 text-sm text-blue-700'>
                  <p>You will receive the remainder of the meat after specialty meats chosen on the next page as ground venison.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {groundVenisonAmountSelected === 'None - All specialty meat' && (
          <div className='rounded-md border border-blue-200 bg-blue-50 p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg className='h-5 w-5 text-blue-400' viewBox='0 0 20 20' fill='currentColor'>
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-blue-800'>All Specialty Meat</h3>
                <div className='mt-2 text-sm text-blue-700'>
                  <p>No ground venison will be made. All meat will be processed into specialty products on the next page.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StepWrapper>
  );
}

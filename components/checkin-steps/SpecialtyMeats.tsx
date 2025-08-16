import { useState, useEffect, useMemo } from 'react';
import SpecialtyMeat from '@/components/SpecialtyMeat';
import StepWrapper from './StepWrapper';
import { StepProps } from './types';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';

type SpecialtyMeatOption = {
  name: string;
  perLot?: string;
  image: string;
  options: { name: string; label: string; price: number }[];
};

const specialtyMeats: SpecialtyMeatOption[] = [
  {
    name: 'Trail Bologna',
    perLot: '3 logs per 5lb lot',
    image: '/trail_bologna.jpg',
    options: [
      { name: 'trailBolognaRegular', label: 'Regular Trail Bologna', price: 15 },
      { name: 'trailBolognaCheddarCheese', label: 'Cheddar Cheese Trail Bologna', price: 20 },
      { name: 'trailBolognaHotPepperJackCheese', label: 'Hot Pepper Jack Cheese Trail Bologna', price: 20 },
    ],
  },
  {
    name: 'Garlic Ring Bologna',
    image: '/garlic_ring.jpg',
    options: [{ name: 'garlicRingBologna', label: 'Garlic Ring Bologna', price: 20 }],
  },
  {
    name: 'Summer Sausage',
    image: '/summer.jpg',
    options: [
      { name: 'summerSausageMild', label: 'Mild Summer Sausage', price: 15 },
      { name: 'summerSausageHot', label: 'Hot Summer Sausage', price: 15 },
    ],
  },
  {
    name: 'Smoked Kielbasa Sausage',
    image: '/smoked_kielbasa_sausage.jpg',
    options: [{ name: 'smokedKielbasaSausage', label: 'Smoked Kielbasa Sausage', price: 17.5 }],
  },
  {
    name: 'Italian Sausage Links',
    image: '/italian_sausage_links.jpg',
    options: [
      { name: 'italianSausageLinksMild', label: 'Mild Italian Sausage Links', price: 15 },
      { name: 'italianSausageLinksHot', label: 'Hot Italian Sausage Links', price: 15 },
    ],
  },
  {
    name: 'BULK Country Breakfast Sausage',
    image: '/country_breakfast_sausage.jpg',
    options: [{ name: 'countryBreakfastSausage', label: 'Country Breakfast Sausage', price: 15 }],
  },
  {
    name: 'Breakfast Links',
    image: '/baby_link.jpg',
    options: [
      { name: 'babyLinksCountry', label: 'Country Breakfast Links', price: 20 },
      { name: 'babyLinksMaple', label: 'Maple Breakfast Links', price: 20 },
    ],
  },
  {
    name: 'Snack Sticks',
    image: '/snack_sticks.jpg',
    options: [
      { name: 'snackSticksRegular', label: 'Regular Snack Sticks', price: 25 },
      { name: 'snackSticksCheddarCheese', label: 'Cheddar Cheese Snack Sticks', price: 30 },
      { name: 'snackSticksHotPepperJackCheese', label: 'Hot Pepper Jack Cheese Snack Sticks', price: 30 },
      { name: 'snackSticksHotHotPepperJackCheese', label: '🔥 HOT Hot Pepper Jack Cheese Snack Sticks', price: 30 },
      { name: 'snackSticksHoneyBBQ', label: 'Honey BBQ Snack Sticks', price: 30 },
    ],
  },
  {
    name: 'Hot Dogs',
    image: '/hot_dog.jpg',
    options: [
      { name: 'hotDogsRegular', label: 'Regular Hot Dogs', price: 17.5 },
      { name: 'hotDogsCheddarCheese', label: 'Cheddar Cheese Hot Dogs', price: 22.5 },
      { name: 'hotDogsHotPepperJackCheese', label: 'Hot Pepper Jack Cheese Hot Dogs', price: 22.5 },
    ],
  },
  {
    name: 'Jerky Restructured',
    image: '/jerky.jpg',
    options: [
      { name: 'jerkyRestructuredHot', label: 'Hot Jerky Restructured', price: 35 },
      { name: 'jerkyRestructuredMild', label: 'Mild Jerky Restructured', price: 35 },
      { name: 'jerkyRestructuredTeriyaki', label: 'Teriyaki Jerky Restructured', price: 35 },
    ],
  },
];

const weightOptions = [
  { value: 'false', label: 'None' },
  { value: '5', label: '5 lbs' },
  { value: '10', label: '10 lbs' },
  { value: '15', label: '15 lbs' },
  { value: '20', label: '20 lbs' },
  { value: '25', label: '25 lbs' },
  { value: '30', label: '30 lbs' },
  { value: 'Evenly', label: 'Evenly Distribute', description: 'Split available meat evenly' },
];

export default function SpecialtyMeats(props: StepProps) {
  const { form } = props;
  const [selectedMeat, setSelectedMeat] = useState<SpecialtyMeatOption | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selections, setSelections] = useState<Record<string, any>>({});

  // Create a stable list of all field names to watch
  const fieldNames = useMemo(() => {
    return specialtyMeats.flatMap((meat) => meat.options.map((option) => option.name.replace(/\s+/g, '')));
  }, []); // Empty dependency array since specialtyMeats is static

  // Initialize all specialty meat fields to 'false' (None) by default
  useEffect(() => {
    fieldNames.forEach((fieldName) => {
      const currentValue = form.getValues(fieldName);
      // Only set default if the field is undefined or null
      if (currentValue === undefined || currentValue === null) {
        form.setValue(fieldName, 'false');
      }
    });
  }, [form, fieldNames]);

  // Watch specific fields instead of all form values
  const formValues = form.watch(fieldNames);

  // Memoize formValues to prevent unnecessary re-renders
  const formValuesKey = JSON.stringify(formValues);
  const memoizedFormValues = useMemo(() => formValues, [formValues, formValuesKey]);

  // Lock/unlock body scroll when modal opens/closes
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to ensure scroll is restored if component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Update selections when form values change
  useEffect(() => {
    const newSelections: Record<string, any> = {};
    fieldNames.forEach((fieldName, index) => {
      const value = memoizedFormValues[index];
      // Only include if value exists and is not 'false', '0', empty string, null, or undefined
      if (value && value !== 'false' && value !== '0' && value !== '' && value !== null && value !== undefined) {
        // Find the meat and option that corresponds to this field
        for (const meat of specialtyMeats) {
          for (const option of meat.options) {
            if (option.name.replace(/\s+/g, '') === fieldName) {
              if (!newSelections[meat.name]) {
                newSelections[meat.name] = [];
              }
              newSelections[meat.name].push({
                label: option.label,
                amount: value,
                price: option.price,
              });
              break;
            }
          }
        }
      }
    });
    setSelections(newSelections);
  }, [memoizedFormValues, fieldNames]);

  const openModal = (meat: SpecialtyMeatOption) => {
    setSelectedMeat(meat);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMeat(null);
  };

  const hasSelections = (meatName: string) => {
    return selections[meatName] && selections[meatName].length > 0;
  };

  const getSelectionSummary = (meatName: string) => {
    if (!selections[meatName]) return '';
    const totalItems = selections[meatName].length;
    const totalWeight = selections[meatName].reduce((sum: number, item: any) => {
      const weight = parseInt(item.amount) || 0;
      return sum + weight;
    }, 0);
    return totalWeight > 0 ? `${totalWeight}lbs` : `${totalItems} item${totalItems > 1 ? 's' : ''}`;
  };

  const handleWeightSelect = (optionName: string, weight: string) => {
    const fieldName = optionName.replace(/\s+/g, '');
    form.setValue(fieldName, weight);
  };

  const getSelectedWeight = (optionName: string) => {
    const fieldName = optionName.replace(/\s+/g, '');
    return form.watch(fieldName) || 'false';
  };

  return (
    <StepWrapper {...props} title='Specialty Meats'>
      <div className='space-y-8'>
        {/* Grid of specialty meat buttons */}
        <div className='grid grid-cols-2 gap-6 '>
          {specialtyMeats.map((meat) => (
            <button
              key={meat.name}
              type='button'
              onClick={() => openModal(meat)}
              className={`group relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-200 hover:shadow-lg ${
                hasSelections(meat.name) ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }`}
            >
              <div className='aspect-[4/3] w-full overflow-hidden'>
                <Image
                  src={meat.image}
                  alt={meat.name}
                  width={400}
                  height={300}
                  className='h-full w-full object-cover transition-transform duration-200 group-hover:scale-110'
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {/* Overlay */}
                <div className='absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-200 group-hover:bg-opacity-30' />
                {/* Text overlay */}
                <div className='absolute inset-0 flex flex-col items-center justify-center p-4 text-center'>
                  <h3 className='text-display-xs  font-bold leading-snug text-white'>{meat.name}</h3>
                  {hasSelections(meat.name) && (
                    <div className='mt-2 rounded-full bg-blue-500 px-2 py-1 text-xs font-medium text-white'>{getSelectionSummary(meat.name)}</div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Selection Summary */}
        {Object.keys(selections).length > 0 && (
          <div className='rounded-md border border-gray-200 bg-gray-50 p-4'>
            <h3 className='mb-3 text-center text-lg font-semibold text-gray-800'>Selected Specialty Meats</h3>
            <div className='grid grid-cols-2 gap-4'>
              {Object.entries(selections).map(([meatName, items]: [string, any]) => (
                <div key={meatName} className='flex flex-col items-start justify-start'>
                  <span className='shrink-0 font-medium text-gray-700'>{meatName}:</span>
                  <span className='ml-3 flex flex-col items-start justify-start text-sm text-gray-600'>
                    {items.map((item: any, index: number) => (
                      <span key={index}>
                        {item.label} ({item.amount === 'Evenly' ? 'Evenly Distribute' : `${item.amount}lbs`}){index < items.length - 1 && ''}
                      </span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedMeat && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
          <div className='relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl'>
            <div className='sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4'>
              <div>
                <h2 className='text-xl font-bold text-gray-800'>
                  {selectedMeat.name}
                  {selectedMeat.options.length === 1 && <span className='text-[#E28532]'> - ${selectedMeat.options[0].price} per 5lb lot</span>}
                </h2>
                {selectedMeat.perLot && <span className='tex-sm text-black/80'>{selectedMeat.perLot}</span>}
              </div>
              <button type='button' onClick={closeModal} className='rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700'>
                <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <div className='max-h-[calc(90vh-80px)] overflow-y-auto p-6 pb-0'>
              {/* Informational Notes */}
              {selectedMeat.name === 'Snack Sticks' && (
                <div className='mb-6 rounded-md border border-blue-200 bg-blue-50 p-4'>
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
                      <h3 className='text-sm font-medium text-blue-800'>Snack Sticks Information</h3>
                      <div className='mt-2 text-sm text-blue-700'>
                        <p>Cooking weight loss on stick is 20-25%</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedMeat.name === 'Jerky Restructured' && (
                <div className='mb-6 rounded-md border border-blue-200 bg-blue-50 p-4'>
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
                      <h3 className='text-sm font-medium text-blue-800'>Restructured Jerky Information</h3>
                      <div className='mt-2 text-sm text-blue-700'>
                        <p>Cooking weight loss on restructured jerky 50%</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className='space-y-8'>
                {selectedMeat.options.map((option) => (
                  <div key={option.name} className='space-y-4'>
                    {selectedMeat.options.length > 1 && (
                      <div className='flex items-center justify-between border-b pb-2'>
                        <h3 className='text-lg font-semibold text-gray-800'>{option.label}</h3>
                        <span className='text-sm font-medium text-[#E28532]'>${option.price} per 5lb lot</span>
                      </div>
                    )}
                    <div className='grid grid-cols-4 gap-3'>
                      {weightOptions.map((weight) => {
                        const selectedWeight = getSelectedWeight(option.name);
                        const isSelected = selectedWeight === weight.value;
                        return (
                          <button
                            key={weight.value}
                            type='button'
                            onClick={() => handleWeightSelect(option.name, weight.value)}
                            className={`group relative w-full rounded-lg border-2 p-3 text-left transition-all duration-200 hover:shadow-md ${
                              isSelected ? 'border-[#E28532] bg-[#E28532]/10 shadow-md' : 'border-gray-300 bg-white hover:border-[#E28532]/50'
                            }`}
                          >
                            <div className='flex items-center justify-between'>
                              <div>
                                <div className='text-sm font-semibold text-gray-900'>{weight.label}</div>
                                {weight.description && <div className='text-xs text-gray-600'>{weight.description}</div>}
                              </div>
                              <div
                                className={`h-4 w-4 rounded-full border-2 transition-all ${
                                  isSelected ? 'border-[#E28532] bg-[#E28532]' : 'border-gray-300 group-hover:border-[#E28532]/50'
                                }`}
                              >
                                {isSelected && <div className='h-full w-full scale-50 rounded-full bg-white'></div>}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Confirm and Close Button */}
              <div className='sticky bottom-0 mt-8 border-t bg-white pb-6 pt-4'>
                <button
                  type='button'
                  onClick={closeModal}
                  className='w-full rounded-lg bg-[#E28532] px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-[#E28532]/90 focus:outline-none focus:ring-2 focus:ring-[#E28532] focus:ring-offset-2'
                >
                  Confirm and Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StepWrapper>
  );
}

import Textarea from '@/components/Textarea';
import StepWrapper from './StepWrapper';
import { StepProps } from './types';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';

export default function Roasts(props: StepProps) {
  const form = useFormContext();

  const roastOptions = [
    { value: 'Grind', label: 'Grind', description: 'Ground with other meat' },
    { value: 'Roasts', label: 'Roasts', description: 'Keep as roasts' },
  ];

  const handleOptionSelect = (value: string) => {
    form.setValue('roast', value);
  };

  const selectedValue = form.watch('roast') || 'Grind';

  return (
    <StepWrapper {...props} title='Roasts'>
      <div className='flex flex-col items-center justify-center gap-6'>
        <div className='mb-6 aspect-square w-48 overflow-hidden rounded-full border-[5px] border-dashed border-[#E28532] bg-tan-1'>
          <Image
            src='/roast.svg'
            className='h-full w-full translate-x-[1rem] translate-y-2 scale-125 object-cover'
            width={500}
            height={300}
            alt='roasts'
          />
        </div>

        <div className='w-full'>
          <p className='mb-4 text-center text-lg font-bold'>Front Shoulders for Roasts</p>
          <div className='grid grid-cols-2 gap-3'>
            {roastOptions.map((option) => (
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

        <div className='hidden w-full'>
          <Textarea rows={2} name='roastNotes' label='Special Instructions' />
        </div>
      </div>
    </StepWrapper>
  );
}

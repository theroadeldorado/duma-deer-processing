import Textarea from '@/components/Textarea';
import StepWrapper from './StepWrapper';
import { StepProps } from './types';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
import { useState } from 'react';

export default function HindLegs(props: StepProps) {
  const form = useFormContext();

  const hindLegOptions = [
    { value: 'Steaks', label: 'Steaks', description: 'Cut into steaks' },
    { value: 'Whole Muscle Jerky', label: 'Whole Muscle Jerky', description: 'Jerky - $35' },
    { value: 'Grind', label: 'Grind', description: 'Ground with other meat' },
  ];

  const jerkyFlavorOptions = [
    { value: 'Mild', label: 'Mild', description: 'Classic mild flavor' },
    { value: 'Hot', label: 'Hot', description: 'Spicy hot flavor' },
    { value: 'Teriyaki', label: 'Teriyaki', description: 'Sweet teriyaki flavor' },
  ];

  const tenderizedOptions = [
    { value: 'false', label: 'No', description: 'Standard steaks' },
    { value: 'true', label: 'Yes', description: 'Tenderized cubed - $20' },
  ];

  const hindLeg1 = form.watch('hindLegPreference1') || 'Steaks';
  const hindLeg2 = form.watch('hindLegPreference2') || 'Steaks';
  const tenderized = form.watch('tenderizedCubedSteaks') || 'false';
  const jerky1Flavor = form.watch('hindLegJerky1Flavor');
  const jerky2Flavor = form.watch('hindLegJerky2Flavor');

  // Check if steaks is selected for either leg
  const showTenderizedOption = hindLeg1 === 'Steaks' || hindLeg2 === 'Steaks';

  const handleHindLeg1Select = (value: string) => {
    form.setValue('hindLegPreference1', value);
    if (value !== 'Whole Muscle Jerky') {
      form.setValue('hindLegJerky1Flavor', '');
    }
    // Reset tenderized option if no steaks selected
    if (value !== 'Steaks' && hindLeg2 !== 'Steaks') {
      form.setValue('tenderizedCubedSteaks', 'false');
    }
  };

  const handleHindLeg2Select = (value: string) => {
    form.setValue('hindLegPreference2', value);
    if (value !== 'Whole Muscle Jerky') {
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

  const ButtonGroup = ({
    options,
    selectedValue,
    onSelect,
    title,
  }: {
    options: any[];
    selectedValue: string;
    onSelect: (value: string) => void;
    title: string;
  }) => (
    <div className='space-y-3'>
      <p className='text-center text-lg font-bold'>{title}</p>
      <div className='grid grid-cols-2 gap-2'>
        {options.map((option) => (
          <button
            key={option.value}
            type='button'
            onClick={() => onSelect(option.value)}
            className={`group relative w-full rounded-lg border-2 p-3 text-left transition-all duration-200 hover:shadow-md ${
              selectedValue === option.value ? 'border-[#E28532] bg-[#E28532]/10 shadow-md' : 'border-gray-300 bg-white hover:border-[#E28532]/50'
            }`}
          >
            <div className='flex items-center justify-between'>
              <div>
                <div className='text-sm font-semibold text-gray-900'>{option.label}</div>
                <div className='text-xs text-gray-600'>{option.description}</div>
              </div>
              <div
                className={`h-4 w-4 rounded-full border-2 transition-all ${
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
  );

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
          <ButtonGroup options={hindLegOptions} selectedValue={hindLeg1} onSelect={handleHindLeg1Select} title='Hind Leg (1) Preference' />

          <ButtonGroup options={hindLegOptions} selectedValue={hindLeg2} onSelect={handleHindLeg2Select} title='Hind Leg (2) Preference' />
        </div>

        {/* Jerky Flavor Options */}
        {hindLeg1 === 'Whole Muscle Jerky' && (
          <div className='w-full'>
            <ButtonGroup
              options={jerkyFlavorOptions}
              selectedValue={jerky1Flavor || ''}
              onSelect={handleJerky1FlavorSelect}
              title='Hind Leg (1) Jerky Flavor'
            />
          </div>
        )}

        {hindLeg2 === 'Whole Muscle Jerky' && (
          <div className='w-full'>
            <ButtonGroup
              options={jerkyFlavorOptions}
              selectedValue={jerky2Flavor || ''}
              onSelect={handleJerky2FlavorSelect}
              title='Hind Leg (2) Jerky Flavor'
            />
          </div>
        )}

        {/* Tenderized Cubed Steaks - Only show if steaks selected */}
        {showTenderizedOption && (
          <div className='w-full'>
            <ButtonGroup options={tenderizedOptions} selectedValue={tenderized} onSelect={handleTenderizedSelect} title='Tenderized Cubed Steaks' />
          </div>
        )}

        <div className='hidden w-full'>
          <Textarea rows={2} name='hindLegNotes' label='Special Instructions' />
        </div>
      </div>
    </StepWrapper>
  );
}

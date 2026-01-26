import { useState, useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DeerT, EditableSection } from '@/lib/types';
import Button from '@/components/Button';

// Import step components
import ProcessingType from '@/components/checkin-steps/ProcessingType';
import CapeHideOptions from '@/components/checkin-steps/CapeHideOptions';
import BackStraps from '@/components/checkin-steps/BackStraps';
import HindLegs from '@/components/checkin-steps/HindLegs';
import Roasts from '@/components/checkin-steps/Roasts';
import GroundVenison from '@/components/checkin-steps/GroundVenison';
import SpecialtyMeats from '@/components/checkin-steps/SpecialtyMeats';
import { FormProvider } from 'react-hook-form';

// Specialty meat field names to clear when donation is selected
const SPECIALTY_MEAT_FIELDS = [
  'trailBolognaRegular',
  'trailBolognaCheddarCheese',
  'trailBolognaHotPepperJackCheese',
  'smokedJalapenoCheddarBrats',
  'garlicRingBologna',
  'summerSausageMild',
  'summerSausageHot',
  'smokedKielbasaSausage',
  'italianSausageLinksMild',
  'italianSausageLinksHot',
  'countryBreakfastSausage',
  'babyLinksCountry',
  'babyLinksMaple',
  'snackSticksRegular',
  'snackSticksCheddarCheese',
  'snackSticksHotPepperJackCheese',
  'snackSticksHotHotPepperJackCheese',
  'snackSticksHoneyBBQ',
  'hotDogsRegular',
  'hotDogsCheddarCheese',
  'hotDogsHotPepperJackCheese',
  'jerkyRestructuredHot',
  'jerkyRestructuredMild',
  'jerkyRestructuredTeriyaki',
];

interface SectionEditorProps {
  section: EditableSection;
  form: UseFormReturn<DeerT>;
  onDone: () => void;
  onCancel: () => void;
}

/**
 * Get the title for an editable section
 */
function getSectionTitle(section: EditableSection): string {
  switch (section) {
    case 'processing-type':
      return 'Processing Type';
    case 'cape-hide':
      return 'Cape, Hide & Euro Mount';
    case 'cutting-preferences':
      return 'Cutting Preferences';
    case 'ground-venison':
      return 'Ground Venison';
    case 'specialty-meats':
      return 'Specialty Meats';
    default:
      return 'Edit Section';
  }
}

/**
 * Wrapper component that provides title and navigation but no form controls
 */
function SectionWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className='space-y-4'>
      <h3 className='text-xl font-bold text-gray-900'>{title}</h3>
      {children}
    </div>
  );
}

export default function SectionEditor({
  section,
  form,
  onDone,
  onCancel,
}: SectionEditorProps) {
  const title = getSectionTitle(section);
  const [showDonationAlert, setShowDonationAlert] = useState(false);
  const [preDonationValue, setPreDonationValue] = useState<string | null>(null);
  const previousProcessingType = useRef<string | null>(null);

  // Watch for donation selection when editing processing type
  const processingType = form.watch('skinnedOrBoneless');

  useEffect(() => {
    if (section === 'processing-type') {
      // Initialize the ref with current value on first render
      if (previousProcessingType.current === null) {
        previousProcessingType.current = processingType ?? null;
        return;
      }

      // Check if changed TO donation
      if (processingType === 'Donation' && previousProcessingType.current !== 'Donation') {
        // Store the value before donation was selected
        setPreDonationValue(previousProcessingType.current);
        setShowDonationAlert(true);
      }

      previousProcessingType.current = processingType ?? null;
    }
  }, [processingType, section]);

  // Handle donation confirmation
  const handleDonationConfirm = () => {
    // Clear all specialty meats
    for (const field of SPECIALTY_MEAT_FIELDS) {
      form.setValue(field as any, 0);
    }

    // Set everything to grind
    form.setValue('backStrapsPreference', 'Grind');
    form.setValue('backStrap2Preference', 'Grind');
    form.setValue('hindLegPreference1', 'Grind');
    form.setValue('hindLegPreference2', 'Grind');
    form.setValue('roast', 'Grind');
    form.setValue('groundVenison', 'Plain');
    form.setValue('groundVenisonAmount', 'Evenly');
    form.setValue('tenderizedCubedSteaks', '');

    // Clear cape/hide options
    form.setValue('cape', '');
    form.setValue('hide', '');
    form.setValue('euroMount', '');

    setShowDonationAlert(false);
    setPreDonationValue(null);
  };

  // Handle donation cancel - revert to previous selection
  const handleDonationCancel = () => {
    const revertTo = preDonationValue || 'Skinned, Cut, Ground, Vacuum packed';
    // Reset the ref so future donation selections trigger the alert
    previousProcessingType.current = revertTo;
    form.setValue('skinnedOrBoneless', revertTo);
    setShowDonationAlert(false);
    setPreDonationValue(null);
  };

  // Create a mock onNext function for step components that require it
  const mockOnNext = () => {};

  // Build step props for the components
  const stepProps = { form, onNext: mockOnNext };

  /**
   * Render the appropriate step component(s) for the section
   */
  const renderStepComponents = () => {
    switch (section) {
      case 'processing-type':
        return <ProcessingType {...stepProps} />;

      case 'cape-hide':
        return <CapeHideOptions {...stepProps} />;

      case 'cutting-preferences':
        return (
          <div className='space-y-6'>
            <BackStraps {...stepProps} />
            <HindLegs {...stepProps} />
            <Roasts {...stepProps} />
          </div>
        );

      case 'ground-venison':
        return <GroundVenison {...stepProps} />;

      case 'specialty-meats':
        return <SpecialtyMeats {...stepProps} />;

      default:
        return <p className='text-gray-500'>Unknown section</p>;
    }
  };

  return (
    <div className='fixed inset-0 z-50 overflow-auto bg-gradient-to-b from-tan-1 to-white'>
      {/* Donation Alert Modal */}
      {showDonationAlert && (
        <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/50'>
          <div className='mx-4 max-w-md rounded-xl bg-white p-6 shadow-xl'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-amber-100'>
                <svg className='h-6 w-6 text-amber-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                  />
                </svg>
              </div>
              <h3 className='text-lg font-bold text-gray-900'>Donation Processing</h3>
            </div>
            <p className='mb-6 text-gray-600'>
              Selecting Donation will remove all specialty meats, cutting preferences, and cape/hide options.
              The deer will be processed as ground venison only.
            </p>
            <div className='flex gap-3'>
              <Button onClick={handleDonationCancel} color='gray' size='md' className='flex-1'>
                Go Back
              </Button>
              <Button onClick={handleDonationConfirm} size='md' className='flex-1'>
                Continue with Donation
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className='container mx-auto max-w-4xl px-4 py-8'>
        {/* Header */}
        <div className='mb-6 flex items-center justify-between'>
          <button
            type='button'
            onClick={onCancel}
            className='flex items-center gap-2 text-gray-600 hover:text-gray-900'
          >
            <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
            Back to Summary
          </button>

          <h2 className='text-xl font-bold text-gray-900'>Edit {title}</h2>

          <div className='w-32' /> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className='rounded-xl bg-white p-6 shadow-sm'>
          <FormProvider {...form}>
            {renderStepComponents()}
          </FormProvider>
        </div>

        {/* Footer Buttons */}
        <div className='mt-6 flex justify-end gap-3'>
          <Button onClick={onCancel} color='gray' size='lg'>
            Cancel
          </Button>
          <Button onClick={onDone} size='lg'>
            Done - Back to Summary
          </Button>
        </div>
      </div>
    </div>
  );
}

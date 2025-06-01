import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DeerT } from '@/lib/types';
import { WizardProps } from './types';
import Form from '@/components/Form';
import Button from '@/components/Button';

export default function FormWizard({ steps, onSubmit, initialData, onFormDataChange }: WizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const form = useForm<DeerT>({
    defaultValues: initialData,
    mode: 'onChange',
  });

  const currentStepConfig = steps[currentStep];
  const CurrentStepComponent = currentStepConfig.component;

  // Watch deer type, quick option, and ground venison amount to handle conditional logic
  const deerType = form.watch('buckOrDoe');
  const quickOption = form.watch('quickOption');
  const groundVenisonAmount = form.watch('groundVenisonAmount');
  const processingType = form.watch('skinnedOrBoneless');

  // Watch all form values to detect if any data has been entered
  const formValues = form.watch();

  // Check if form has any data
  useEffect(() => {
    if (!onFormDataChange) return;

    const hasData = Object.values(formValues).some((value) => {
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'number') return value !== 0;
      if (Array.isArray(value)) return value.length > 0;
      return value != null;
    });

    onFormDataChange(hasData);
  }, [formValues, onFormDataChange]);

  // Function to get shortened step names
  const getShortStepName = (title: string): string => {
    const shortNames: Record<string, string> = {
      'Customer Information': 'Customer',
      'Deer Information': 'Deer Info',
      'Processing Type': 'Processing',
      'Cape & Hide Options': 'Cape/Hide',
      'Quick Options': 'Quick',
      'Back Straps': 'Straps',
      'Hind Legs': 'Steaks',
      Roasts: 'Roasts',
      'Ground Venison': 'Burger',
      'Specialty Meats': 'Specialty',
      Summary: 'Summary',
    };
    return shortNames[title] || title;
  };

  // Function to check if a step should be skipped
  const shouldSkipStep = (stepIndex: number) => {
    const step = steps[stepIndex];

    // Skip ProcessingType step if deer type is "Boneless"
    if (step.title === 'Processing Type' && deerType === 'Boneless') {
      return true;
    }

    // Skip all detail steps if "Donation" is selected
    if (processingType === 'Donation') {
      if (
        step.title === 'Cape & Hide Options' ||
        step.title === 'Quick Options' ||
        step.title === 'Back Straps' ||
        step.title === 'Hind Legs' ||
        step.title === 'Roasts' ||
        step.title === 'Ground Venison' ||
        step.title === 'Specialty Meats'
      ) {
        return true;
      }
    }

    // Skip detail steps if "Grind Everything" is selected
    if (quickOption === 'Grind Everything - All Burger') {
      if (
        step.title === 'Back Straps' ||
        step.title === 'Hind Legs' ||
        step.title === 'Roasts' ||
        step.title === 'Ground Venison' ||
        step.title === 'Specialty Meats'
      ) {
        return true;
      }
    }

    // Skip Specialty Meats if "All Burger No Specialty Meat" is selected
    if (step.title === 'Specialty Meats' && groundVenisonAmount === 'All Burger No Specialty Meat') {
      return true;
    }

    return false;
  };

  // Function to find the next valid step
  const getNextStep = (fromStep: number): number => {
    let nextStep = fromStep + 1;

    // Special case: if we're on ProcessingType and "Donation" is selected, jump to Summary
    if (steps[fromStep].title === 'Processing Type' && processingType === 'Donation') {
      return steps.findIndex((step) => step.title === 'Summary');
    }

    // Special case: if we're on Quick Options and "Grind Everything" is selected, jump to Summary
    if (steps[fromStep].title === 'Quick Options' && quickOption === 'Grind Everything - All Burger') {
      return steps.findIndex((step) => step.title === 'Summary');
    }

    // Special case: if we're on Ground Venison and "All Burger No Specialty Meat" is selected, jump to Summary
    if (steps[fromStep].title === 'Ground Venison' && groundVenisonAmount === 'All Burger No Specialty Meat') {
      return steps.findIndex((step) => step.title === 'Summary');
    }

    while (nextStep < steps.length && shouldSkipStep(nextStep)) {
      nextStep++;
    }

    return nextStep;
  };

  // Function to find the previous valid step
  const getPreviousStep = (fromStep: number): number => {
    let prevStep = fromStep - 1;

    // Special case: if we're on Summary and came from ProcessingType with "Donation"
    if (steps[fromStep].title === 'Summary' && processingType === 'Donation') {
      return steps.findIndex((step) => step.title === 'Processing Type');
    }

    // Special case: if we're on Summary and came from Quick Options with "Grind Everything"
    if (steps[fromStep].title === 'Summary' && quickOption === 'Grind Everything - All Burger') {
      return steps.findIndex((step) => step.title === 'Quick Options');
    }

    // Special case: if we're on Summary and came from Ground Venison with "All Burger No Specialty Meat"
    if (steps[fromStep].title === 'Summary' && groundVenisonAmount === 'All Burger No Specialty Meat') {
      return steps.findIndex((step) => step.title === 'Ground Venison');
    }

    while (prevStep >= 0 && shouldSkipStep(prevStep)) {
      prevStep--;
    }

    return prevStep;
  };

  // Auto-set processing type when deer type is boneless
  useEffect(() => {
    if (deerType === 'Boneless') {
      form.setValue('skinnedOrBoneless', 'Boneless');
    }
  }, [deerType, form]);

  const handleNext = async () => {
    // Validate current step fields if validation is configured
    if (currentStepConfig.validationFields) {
      const isValid = await form.trigger(currentStepConfig.validationFields as string[]);
      if (!isValid) return;
    } else {
      // Validate all fields if no specific validation is set
      const isValid = await form.trigger();
      if (!isValid) return;
    }

    const nextStep = getNextStep(currentStep);
    if (nextStep < steps.length) {
      setCurrentStep(nextStep);
    }
  };

  const handleBack = () => {
    const prevStep = getPreviousStep(currentStep);
    if (prevStep >= 0) {
      setCurrentStep(prevStep);
    }
  };

  const handleSubmit = (data: DeerT) => {
    onSubmit(data);
  };

  // Get step status for display
  const getStepStatus = (stepIndex: number) => {
    if (shouldSkipStep(stepIndex)) return 'skipped';
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  // Check if we're on first/last step (excluding skipped steps)
  const isFirstStep = getPreviousStep(currentStep) < 0;
  const isLastStep = getNextStep(currentStep) >= steps.length;

  return (
    <div className='flex flex-col gap-6'>
      {/* Step Indicators */}
      <div className='flex flex-wrap items-center justify-center'>
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          if (status === 'skipped') return null;

          // Find the next visible step
          const nextVisibleStepIndex = steps.findIndex((_, nextIndex) => nextIndex > index && getStepStatus(nextIndex) !== 'skipped');
          const hasNextVisibleStep = nextVisibleStepIndex !== -1;

          return (
            <div key={step.id} className='flex items-start'>
              <div className='flex flex-col items-center'>
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                    status === 'completed'
                      ? 'bg-primary-blue text-white'
                      : status === 'current'
                      ? 'bg-primary-blue text-white ring-2 ring-primary-blue ring-offset-2'
                      : 'bg-tan-1 text-gray-600'
                  }`}
                >
                  {status === 'completed' ? (
                    <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                  ) : (
                    <span className='inline-block -translate-y-px'>{index + 1}</span>
                  )}
                </div>
                <span className={`mt-1 inline-block text-xs font-medium ${status === 'current' ? 'text-primary-blue' : 'text-gray-600'}`}>
                  {getShortStepName(step.title)}
                </span>
              </div>
              {hasNextVisibleStep && <div className={`mx-1 mt-4 h-0.5 w-4 ${status === 'completed' ? 'bg-primary-blue' : 'bg-tan-1'}`} />}
            </div>
          );
        })}
      </div>

      {/* Top Navigation Buttons */}
      <div className='flex hidden justify-between gap-4'>
        {/* Back Button */}
        {!isFirstStep ? (
          <Button type='button' className='inline-flex gap-2' onClick={handleBack}>
            <svg xmlns='http://www.w3.org/2000/svg' height='1em' viewBox='0 0 320 512'>
              <path
                fill='currentColor'
                d='M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z'
              />
            </svg>
            Back
          </Button>
        ) : (
          <div></div>
        )}

        {/* Next/Submit Button */}
        {!isLastStep ? (
          <Button type='button' className='inline-flex gap-2' onClick={handleNext}>
            Next
            <svg className='rotate-180' xmlns='http://www.w3.org/2000/svg' height='1em' viewBox='0 0 320 512'>
              <path
                fill='currentColor'
                d='M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z'
              />
            </svg>
          </Button>
        ) : (
          <>
            <Button type='submit' className='inline-flex origin-right scale-150 gap-2 bg-[#E28532]'>
              Submit Order
            </Button>
            <div className='w-20'></div>
          </>
        )}
      </div>

      <Form onSubmit={handleSubmit} form={form} className='flex flex-col gap-6'>
        <CurrentStepComponent form={form} />

        {/* Bottom Navigation Buttons */}
        <div className='flex justify-between gap-4'>
          {/* Back Button */}
          {!isFirstStep ? (
            <Button type='button' className='inline-flex gap-2' onClick={handleBack}>
              <svg xmlns='http://www.w3.org/2000/svg' height='1em' viewBox='0 0 320 512'>
                <path
                  fill='currentColor'
                  d='M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z'
                />
              </svg>
              Back
            </Button>
          ) : (
            <div></div>
          )}

          {/* Next/Submit Button */}
          {!isLastStep ? (
            <Button type='button' className='inline-flex gap-2' onClick={handleNext}>
              Next
              <svg className='rotate-180' xmlns='http://www.w3.org/2000/svg' height='1em' viewBox='0 0 320 512'>
                <path
                  fill='currentColor'
                  d='M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z'
                />
              </svg>
            </Button>
          ) : (
            <>
              <Button type='submit' className='inline-flex origin-right scale-150 gap-2 bg-[#E28532]'>
                Submit Order
              </Button>
              <div className='w-20'></div>
            </>
          )}
        </div>
      </Form>
    </div>
  );
}

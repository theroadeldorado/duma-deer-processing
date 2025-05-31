import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DeerT } from '@/lib/types';
import { WizardProps } from './types';
import Form from '@/components/Form';

export default function FormWizard({ steps, onSubmit, initialData }: WizardProps) {
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

  // Function to check if a step should be skipped
  const shouldSkipStep = (stepIndex: number) => {
    const step = steps[stepIndex];

    // Skip ProcessingType step if deer type is "Boneless"
    if (step.title === 'Processing Type' && deerType === 'Boneless') {
      return true;
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

  // Calculate progress excluding skipped steps
  const totalSteps = steps.filter((_, index) => !shouldSkipStep(index)).length;
  const completedSteps = steps.slice(0, currentStep + 1).filter((_, index) => !shouldSkipStep(index)).length;
  const progressPercentage = ((completedSteps - 1) / (totalSteps - 1)) * 100;

  return (
    <div className='flex flex-col gap-6'>
      {/* Progress Bar */}
      <div className='relative h-4 w-full overflow-hidden rounded-full bg-tan-1'>
        <div
          className='absolute left-0 top-0 h-4 bg-primary-blue transition-all duration-500'
          style={{ width: `${Math.max(0, progressPercentage)}%` }}
        />
      </div>

      <Form onSubmit={handleSubmit} form={form} className='flex flex-col gap-6'>
        <CurrentStepComponent
          form={form}
          onNext={handleNext}
          onBack={handleBack}
          isFirstStep={currentStep === 0}
          isLastStep={currentStep === steps.length - 1}
        />
      </Form>
    </div>
  );
}

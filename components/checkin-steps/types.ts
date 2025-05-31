import { UseFormReturn } from 'react-hook-form';
import { DeerT } from '@/lib/types';

export interface StepProps {
  form: UseFormReturn<DeerT>;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export interface StepConfig {
  id: number;
  title: string;
  component: React.ComponentType<StepProps>;
  validationFields?: (keyof DeerT)[];
}

export interface WizardProps {
  steps: StepConfig[];
  onSubmit: (data: DeerT) => void;
  initialData?: Partial<DeerT>;
}

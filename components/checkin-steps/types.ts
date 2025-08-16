import { UseFormReturn } from 'react-hook-form';
import { DeerT } from '@/lib/types';

export interface StepProps {
  form: UseFormReturn<DeerT>;
  onNext?: () => void;
}

export interface StepConfig {
  id: number;
  title: string;
  component: React.ComponentType<StepProps>;
  validationFields?: (keyof DeerT)[];
  customValidation?: (form: UseFormReturn<DeerT>) => boolean;
}

export interface WizardProps {
  steps: StepConfig[];
  onSubmit: (data: DeerT) => void;
  initialData?: Partial<DeerT>;
  onFormDataChange?: (hasData: boolean) => void;
}

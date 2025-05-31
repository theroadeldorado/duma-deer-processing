import { StepProps } from './types';

interface StepWrapperProps extends StepProps {
  children: React.ReactNode;
  title?: string;
}

export default function StepWrapper({ children, title }: StepWrapperProps) {
  return (
    <div className='flex flex-col gap-6'>
      {title && <h2 className='text-center text-display-md font-bold'>{title}</h2>}
      <div className='flex flex-col gap-6'>{children}</div>
    </div>
  );
}

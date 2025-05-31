import Button from '@/components/Button';
import { StepProps } from './types';

interface StepWrapperProps extends StepProps {
  children: React.ReactNode;
  title?: string;
  showNavigation?: boolean;
}

export default function StepWrapper({ children, title, onNext, onBack, isFirstStep, isLastStep, showNavigation = true }: StepWrapperProps) {
  return (
    <div className='flex flex-col gap-6'>
      {title && <h2 className='text-center text-display-md font-bold'>{title}</h2>}

      <div className='flex flex-col gap-6'>{children}</div>

      {showNavigation && (
        <div className='flex justify-between gap-4'>
          {/* Back Button */}
          {!isFirstStep ? (
            <Button type='button' className='inline-flex gap-2' onClick={onBack}>
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
            <Button type='button' className='inline-flex gap-2' onClick={onNext}>
              Next
              <svg xmlns='http://www.w3.org/2000/svg' height='1em' viewBox='0 0 320 512'>
                <path
                  fill='currentColor'
                  d='M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z'
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
      )}
    </div>
  );
}

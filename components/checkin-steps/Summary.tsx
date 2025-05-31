import StepWrapper from './StepWrapper';
import { StepProps } from './types';

export default function Summary(props: StepProps) {
  return (
    <StepWrapper {...props} title='Summary & Checkout'>
      <div className='space-y-4'>
        <p className='text-center text-lg'>Please review your selections and complete the checkout process.</p>

        {/* Summary content will be populated here */}
        <div className='text-center text-sm text-gray-600'>Summary of all selections will be displayed here.</div>
      </div>
    </StepWrapper>
  );
}

import { useRouter } from 'next/router';
import useMutation from '@/hooks/useMutation';
import { DeerT } from '@/lib/types';
import { calculateTotalPrice, calculateCapeHideTotal } from '@/lib/priceCalculations';
import { FormWizard, stepConfigs } from './checkin-steps';

interface CheckInFormRefactoredProps {
  onFormDataChange?: (hasData: boolean) => void;
}

const CheckInFormRefactored = ({ onFormDataChange }: CheckInFormRefactoredProps) => {
  const router = useRouter();

  const mutation = useMutation({
    url: '/api/auth/deer',
    method: 'POST',
    onSuccess: async (data: any) => {
      router.push('/success');
    },
  });

  const handleSubmit = async (formData: DeerT) => {
    const totalPrice = calculateTotalPrice(formData);
    const capeHideTotal = calculateCapeHideTotal(formData);

    const data = {
      ...formData,
      _id: formData.tagNumber + Date.now(),
      hasPrinted: 'false',
      name: formData.firstName + ' ' + formData.lastName,
      totalPrice: totalPrice,
      capeHideTotal: capeHideTotal,
    };

    mutation.mutate(data as any);
  };

  // Test mode: auto-fill forms when ?test is in URL
  const getTestData = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return {
      // CustomerInfo fields
      firstName: 'John',
      lastName: 'Doe',
      phone: '5551234567',
      communication: 'Text',
      address: '123 Main Street',
      city: 'Columbus',
      state: 'OH',
      zip: 43215,
      name: 'John Doe',
      fullAddress: '123 Main Street\n Columbus, OH 43215',

      // DeerInfo fields
      tagNumber: 'TEST-' + Date.now().toString().slice(-6),
      stateHarvestedIn: 'OH',
      buckOrDoe: 'Buck',
      dateHarvested: yesterday.toISOString().split('T')[0],
      dateFound: today.toISOString().split('T')[0],
    };
  };

  const isTestMode = router.query.test !== undefined;

  return (
    <>
      {isTestMode && (
        <div className='mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-3'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg className='h-5 w-5 text-yellow-400' viewBox='0 0 20 20' fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-yellow-800'>Test Mode Active</h3>
              <div className='mt-1 text-sm text-yellow-700'>
                <p>Customer and Deer information has been pre-filled for testing purposes.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <FormWizard steps={stepConfigs} onSubmit={handleSubmit} initialData={isTestMode ? getTestData() : {}} onFormDataChange={onFormDataChange} />
    </>
  );
};

export default CheckInFormRefactored;

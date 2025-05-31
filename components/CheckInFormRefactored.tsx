import { useRouter } from 'next/router';
import useMutation from '@/hooks/useMutation';
import { DeerT } from '@/lib/types';
import { calculateTotalPrice } from '@/lib/priceCalculations';
import { FormWizard, stepConfigs } from './checkin-steps';

const CheckInFormRefactored = () => {
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

    const data = {
      ...formData,
      _id: formData.tagNumber + Date.now(),
      hasPrinted: 'false',
      name: formData.firstName + ' ' + formData.lastName,
      totalPrice: totalPrice,
    };

    mutation.mutate(data as any);
  };

  return <FormWizard steps={stepConfigs} onSubmit={handleSubmit} initialData={{}} />;
};

export default CheckInFormRefactored;

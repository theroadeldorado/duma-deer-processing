import * as React from 'react';
import type { NextPage } from 'next';
import Input from 'components/Input';
import Button from 'components/Button';
import { useForm } from 'react-hook-form';
import Form from 'components/Form';
import UtilityPage from '@/components/layouts/Utility';
import useMutation from 'hooks/useMutation';
import Link from 'next/link';
import Icon from 'components/Icon';

type Inputs = {
  email: string;
};

export default function Forgot() {
  const [showSuccess, setShowSuccess] = React.useState<boolean>(false);
  const form = useForm<Inputs>();

  const mutation = useMutation({
    url: '/api/auth/reset',
    method: 'POST',
    onSuccess: () => {
      setShowSuccess(true);
    },
  });

  return (
    <UtilityPage heading='Forgot Password'>
      <Form onSubmit={mutation.mutate} form={form}>
        <div className='mx-auto max-w-[375px]'>
          <Input label='Email' type='email' name='email' required />

          {showSuccess && <div className='mt-4 rounded bg-yellow-200 p-4'>An email has been sent with further instructions</div>}
          {!showSuccess && (
            <p className='mt-6 text-center'>
              <Button type='submit' disabled={mutation.isLoading} className='w-full'>
                Submit
              </Button>
            </p>
          )}
          <p className='mt-4'>
            <Link href='/login' className='font-semibold text-gray-600'>
              <Icon name='arrowLeft' className='mr-2' />
              Back to log in
            </Link>
          </p>
        </div>
      </Form>
    </UtilityPage>
  );
}

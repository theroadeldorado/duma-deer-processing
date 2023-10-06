'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import useFirebaseLogin from 'hooks/useFirebaseLogin';
import Input from 'components/Input';
import Button from 'components/Button';
import { useForm, SubmitHandler } from 'react-hook-form';
import Form from 'components/Form';
import PageWrapper from '../PageWrapper';
import Link from 'next/link';

type Inputs = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const { login } = useFirebaseLogin();
  const form = useForm<Inputs>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const unauthorized = searchParams.get('unauthorized');

  const handleSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    const success = await login(email, password);
    if (success) router.push('/');
  };

  return (
    <>
      {unauthorized === 'true' && <div className='mb-4 rounded bg-yellow-200 p-4'>You don&apos;t have permission to access that page.</div>}
      <Form onSubmit={handleSubmit} form={form} className='flex flex-col gap-4'>
        <Input label='Email' type='email' name='email' required />
        <Input label='Password' type='password' name='password' required />
        <Link href='/forgot' className='text-sm font-semibold text-gray-600'>
          Forgot Password
        </Link>
        <p className='mt-4 text-center'>
          <Button type='submit' className='w-full'>
            Login
          </Button>
        </p>
        <p className='mt-4 text-center'>
          Don&apos;t have an account?{' '}
          <Link href='/signup' className='font-semibold text-blue-500'>
            Sign Up
          </Link>
        </p>
      </Form>
    </>
  );
}

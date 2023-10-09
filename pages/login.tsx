import { useRouter } from 'next/router';
import useFirebaseLogin from 'hooks/useFirebaseLogin';
import type { NextPage } from 'next';
import Input from 'components/Input';
import Button from 'components/Button';
import { useForm, SubmitHandler } from 'react-hook-form';
import Form from 'components/Form';
import UtilityPage from '@/components/layouts/Utility';
import Link from 'next/link';

type Inputs = {
  email: string;
  password: string;
};

export default function Login() {
  const { login } = useFirebaseLogin();
  const form = useForm<Inputs>();
  const router = useRouter();
  const redirect = (router.query.redirect as string) || '/';
  const unauthorized = router.query.unauthorized as string;

  const handleSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    const success = await login(email, password);
    if (success) router.push(redirect);
  };

  return (
    <UtilityPage heading='Login'>
      {unauthorized === 'true' && <div className='p-4 mb-4 bg-yellow-200 rounded'>You don&apos;t have permission to access that page.</div>}
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

        {/* add anonymous login button */}
        <p className='mt-4 text-center'>
          <Button type='button' onClick={handleSubmit}>
            Login as guest
          </Button>
        </p>
      </Form>
    </UtilityPage>
  );
}

'use client';
import { useRouter } from 'next/navigation';
import useFirebaseLogin from 'hooks/useFirebaseLogin';
import Input from 'components/Input';
import Button from 'components/Button';
import { useForm, SubmitHandler } from 'react-hook-form';
import Form from 'components/Form';
import useMutation from 'hooks/useMutation';
import toast from 'react-hot-toast';
import Link from 'next/link';

type Inputs = {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
};

export default function SignupForm() {
  const { login } = useFirebaseLogin();
  const router = useRouter();
  const form = useForm<Inputs>();

  const mutation = useMutation({
    url: '/api/auth/signup',
    method: 'POST',
    onSuccess: async (data: any) => {
      const loginSuccess = await login(data.email, data.password, true);
      if (loginSuccess) {
        router.push('/');
      } else {
        router.push('/login');
      }
    },
  });

  const handleSubmit: SubmitHandler<Inputs> = async ({ passwordConfirm, ...data }) => {
    if (passwordConfirm !== data.password) {
      toast.error('Passwords do not matc');
      return;
    }

    mutation.mutate(data);
  };

  return (
    <Form onSubmit={handleSubmit} form={form} className='flex flex-col gap-4'>
      <div>
        <Input type='text' label='Full Name' name='name' required />
      </div>
      <Input type='email' name='email' label='Email' required />
      <div>
        <label className='text-gray-600'>
          Password
          <span className='text-red-600'>*</span>
        </label>
        <div className='grid-cols-2 gap-2 sm:grid'>
          <Input type='password' name='password' placeholder='New password' required validateNewPassword />
          <Input type='password' name='passwordConfirm' placeholder='Confirm' required />
        </div>
      </div>
      <p className='mt-4 text-center'>
        <Button type='submit' disabled={mutation.isLoading} className='w-full'>
          Sign Up
        </Button>
      </p>
      <p className='mt-4 text-center'>
        Already have an account?{' '}
        <Link href='/login' className='font-semibold text-blue-500'>
          Log In
        </Link>
      </p>
    </Form>
  );
}

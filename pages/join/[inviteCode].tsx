import React from 'react';
import { GetServerSideProps } from 'next';
import Input from 'components/Input';
import Button from 'components/Button';
import { useForm, SubmitHandler } from 'react-hook-form';
import Form from 'components/Form';
import UtilityPage from '@/components/layouts/Utility';
import { getProfileByCode } from 'lib/mongo';
import toast from 'react-hot-toast';
import useMutation from 'hooks/useMutation';
import useFirebaseLogin from 'hooks/useFirebaseLogin';
import { useRouter } from 'next/router';

type Inputs = {
  password: string;
  passwordConfirm: string;
};

type Props = {
  email: string;
  inviteCode: any;
};

export default function Join({ inviteCode, email }: Props) {
  const form = useForm<Inputs>();
  const { login } = useFirebaseLogin();
  const router = useRouter();

  const mutation = useMutation({
    url: '/api/auth/join',
    method: 'POST',
    onSuccess: async (data: any) => {
      await login(email, data.password, true);
      router.push('/');
    },
  });

  const handleSubmit: SubmitHandler<Inputs> = async ({ password, passwordConfirm }) => {
    if (password !== passwordConfirm) {
      toast.error('Passwords do not match');
      return;
    }
    mutation.mutate({ password, inviteCode });
  };

  return (
    <UtilityPage heading='Set Password'>
      <Form onSubmit={handleSubmit} form={form} className='flex flex-col gap-4'>
        <Input label={'New Password'} type='password' name='password' required validateNewPassword />
        <Input label={'Confirm Password'} type='password' name='passwordConfirm' required />
        <p className='mt-4 text-center'>
          <Button type='submit' disabled={mutation.isLoading}>
            Set Password
          </Button>
        </p>
      </Form>
    </UtilityPage>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const inviteCode = query.inviteCode as string;
  const profile = await getProfileByCode(inviteCode);
  if (!profile) return { notFound: true };

  return { props: { inviteCode, email: profile.email } };
};

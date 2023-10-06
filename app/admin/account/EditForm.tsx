'use client';
import React from 'react';
import { ProfileT } from 'lib/types';
import Button from 'components/Button';
import Input from 'components/Input';
import Form from 'components/Form';
import { useForm } from 'react-hook-form';
import useMutation from 'hooks/useMutation';
import { useRouter } from 'next/navigation';

type Inputs = {
  email: string;
  name: string;
};

type Props = {
  profile?: ProfileT;
};

export default function EditForm({ profile }: Props) {
  const router = useRouter();
  const form = useForm<Inputs>({
    defaultValues: profile,
  });

  const mutation = useMutation({
    url: '/api/account',
    method: 'PUT',
    onSuccess: async () => {
      router.push('/admin');
    },
  });

  return (
    <Form form={form} onSubmit={mutation.mutate}>
      <div className='my-8 bg-white shadow sm:rounded-lg'>
        <div className='flex flex-col gap-4 p-6'>
          <Input type='text' name='name' label='Full Name' required />
          <Input type='email' name='email' label='Email' required />
          <div>
            <label className='text-gray-700'>Change Password (optional)</label>
            <div className='mt-1 grid gap-2 sm:grid-cols-2'>
              <Input type='password' name='password' placeholder='New password' validateNewPassword />
              <Input type='password' name='confirmPassword' placeholder='Confirm' />
            </div>
          </div>
          <div></div>
        </div>
        <div className='flex rounded-b-lg bg-gray-50 px-4 py-3 sm:px-6'>
          <Button type='submit' disabled={mutation.isLoading} className='ml-auto font-medium'>
            Save
          </Button>
        </div>
      </div>
    </Form>
  );
}

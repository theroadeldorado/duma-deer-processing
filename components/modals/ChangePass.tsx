'use client';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Form from 'components/Form';
import Button from 'components/Button';
import useMutation from 'hooks/useMutation';
import Input from 'components/Input';
import { useModal } from '@/providers/ModalProvider';
import toast from 'react-hot-toast';

type Props = {
  id: string;
  name: string;
  email: string;
};

export default function ChangePass({ id, name, email }: Props) {
  const { close } = useModal();
  const form = useForm<any>();

  const mutation = useMutation({
    url: `/api/users/${id}/change-pass`,
    method: 'PATCH',
    successMessage: 'Password updated',
    onSuccess: async () => {
      close();
    },
  });

  const handleSubmit: SubmitHandler<any> = async ({ password }) => {
    if (password.length < 8) return toast.error('Password must be at least 8 characters');
    if (!confirm('Have you communicated this change to the user? You can NOT view the password after saving.')) return;
    mutation.mutate({ password });
  };

  return (
    <Form form={form} onSubmit={handleSubmit} className='min-w-[250px]'>
      <p className='mb-4 text-sm text-gray-600'>
        <strong>{name}</strong>
        <br />
        {email}
      </p>

      <Input type='text' name='password' label='New Password' className='max-w-xs' autocomplete='off' />

      <div className='mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3'>
        <Button type='submit' disabled={mutation.isLoading}>
          Save Password
        </Button>
      </div>
    </Form>
  );
}

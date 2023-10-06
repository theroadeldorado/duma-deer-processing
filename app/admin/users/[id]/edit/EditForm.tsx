'use client';
import React from 'react';
import { ProfileT, ProfileInputT } from 'lib/types';
import Button from 'components/Button';
import Input from 'components/Input';
import Form from 'components/Form';
import { useForm } from 'react-hook-form';
import useMutation from 'hooks/useMutation';
import { useRouter } from 'next/navigation';
import SelectRole from 'components/SelectRole';
import { ProfileZ } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';

type Props = {
  profile?: ProfileT;
  isNew?: boolean;
};

export default function EditForm({ profile, isNew }: Props) {
  const router = useRouter();
  const form = useForm<ProfileInputT>({
    defaultValues: profile,
    resolver: zodResolver(ProfileZ),
  });

  const mutation = useMutation({
    url: isNew ? '/api/users' : `/api/users/${profile?._id}`,
    method: isNew ? 'POST' : 'PUT',
    successMessage: isNew ? 'User invited successfully' : 'User saved successfully',
    onSuccess: () => {
      router.push('/admin/users');
    },
  });

  const del = useMutation({
    url: `/api/users/${profile?._id}`,
    method: 'DELETE',
    successMessage: 'User deleted successfully',
    onSuccess: () => {
      router.push('/admin/users');
    },
  });

  const deleteUser = async () => {
    if (!confirm('Are you sure you want to permanently delete this user?')) return;
    del.mutate({});
  };

  return (
    <Form form={form} onSubmit={mutation.mutate}>
      <div className='my-8 bg-white shadow sm:rounded-lg'>
        <div className='flex flex-col gap-4 p-6'>
          <Input type='text' name='name' label='Full Name' required />
          <Input type='email' name='email' label='Email' required />
          <SelectRole name='role' label='Role' required />
          <div>
            {isNew && <p className='mt-4 text-sm text-gray-600'>Instructions will be emailed to the user with a link to set their password.</p>}
          </div>
        </div>
        <div className='flex rounded-b-lg bg-gray-50 px-4 py-3 sm:px-6'>
          {!isNew && (
            <Button color='danger' onClick={deleteUser} disabled={del.isLoading}>
              Delete User
            </Button>
          )}
          <Button type='submit' disabled={mutation.isLoading} className='ml-auto font-medium'>
            {isNew ? 'Add User' : 'Save User'}
          </Button>
        </div>
      </div>
    </Form>
  );
}

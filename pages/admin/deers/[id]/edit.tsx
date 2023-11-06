import React from 'react';
import { ParsedUrlQuery } from 'querystring';
import AdminPage from '@/components/layouts/Admin';
import { DeerT, DeerInputT } from 'lib/types';
import Button from 'components/Button';
import Input from 'components/Input';
import Form from 'components/Form';
import { useForm } from 'react-hook-form';
import getSecureServerSideProps from 'lib/getSecureServerSideProps';
import { useRouter } from 'next/router';
import { getDeer } from 'lib/mongo';
import useMutation from 'hooks/useMutation';
import { zodResolver } from '@hookform/resolvers/zod';
import { DeerZ } from '@/lib/zod';

type Props = {
  data?: DeerT;
  isNew?: boolean;
};

export default function EditDeer({ data, isNew }: Props) {
  const router = useRouter();
  const form = useForm<DeerInputT>({
    defaultValues: data,
    resolver: zodResolver(DeerZ),
  });

  const mutation = useMutation({
    url: isNew ? '/api/deer/add' : `/api/deer/${data?._id}/update`,
    method: isNew ? 'POST' : 'PUT',
    successMessage: isNew ? 'Deer added successfully' : 'Deer updated successfully',
    onSuccess: () => {
      router.push('/admin/deer');
    },
  });

  const deleteDeer = async () => {
    if (!confirm('Are you sure you want to permanently delete this deer record?')) return;
    del.mutate({});
  };

  // Add mutation for deletion as well if needed, similar to the profile deletion mutation above

  return (
    <AdminPage title={isNew ? 'Add Deer' : 'Edit Deer'}>
      <Form form={form} onSubmit={mutation.mutate} className='mx-auto max-w-xl'>
        {/* ... Rest of your form with Input components corresponding to deer fields ... */}
        <div className='flex rounded-b-lg bg-gray-50 px-4 py-3 sm:px-6'>
          {!isNew && (
            <Button color='danger' onClick={deleteDeer} disabled={del.isLoading}>
              Delete Deer
            </Button>
          )}
          <Button type='submit' disabled={mutation.isLoading} className='ml-auto font-medium'>
            {isNew ? 'Add Deer' : 'Save Deer'}
          </Button>
        </div>
      </Form>
    </AdminPage>
  );
}

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getServerSideProps = getSecureServerSideProps(async (context) => {
  const { id } = context.query as Params;

  if (id === 'new') {
    return {
      props: { isNew: true },
    };
  }

  try {
    const deer = await getDeer(id);
    if (!deer) return { notFound: true };
    return {
      props: { data: deer },
    };
  } catch (error) {
    return { notFound: true };
  }
}, true);

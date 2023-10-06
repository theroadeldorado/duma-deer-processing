import { useRouter } from 'next/router';
import Input from 'components/Input';
import Button from 'components/Button';
import { useForm } from 'react-hook-form';
import Form from 'components/Form';
import AdminPage from '@/components/layouts/Admin';
import getSecureServerSideProps from '@/lib/getSecureServerSideProps';
import { getProfile } from '@/lib/mongo';
import { ProfileT } from '@/lib/types';
import useMutation from 'hooks/useMutation';

type Inputs = {
  email: string;
  name: string;
};

type Props = {
  data: ProfileT;
};

export default function Edit({ data }: Props) {
  const router = useRouter();
  const form = useForm<Inputs>({
    defaultValues: data,
  });

  const mutation = useMutation({
    url: '/api/update-account',
    method: 'PUT',
    onSuccess: async () => {
      router.push('/admin');
    },
  });

  return (
    <AdminPage title='My Account'>
      <Form form={form} onSubmit={mutation.mutate} className='mx-auto max-w-xl'>
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
    </AdminPage>
  );
}

export const getServerSideProps = getSecureServerSideProps(async (context, session) => {
  try {
    const { profileId } = session;
    const data = await getProfile(profileId);
    if (!data) return { notFound: true };

    return {
      props: { data },
    };
  } catch (error) {
    return { notFound: true };
  }
}, true);

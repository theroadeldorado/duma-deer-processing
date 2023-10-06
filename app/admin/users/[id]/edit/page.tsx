import EditForm from './EditForm';
import { notFound } from 'next/navigation';
import { getProfile } from 'lib/mongo';
import { getMetadata } from '@/lib/helpers';

export const metadata = getMetadata({
  title: 'Edit User',
});

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const id = params.id;
  const isNew = id === 'new';

  const profile = isNew ? undefined : await getProfile(id);
  if (!isNew && !profile) notFound();

  return (
    <div className='mx-auto my-12 max-w-xl'>
      <h1 className=' text-2xl font-bold text-gray-600'>{isNew ? 'Invite User' : 'Edit User'}</h1>
      {isNew ? <EditForm isNew /> : <EditForm profile={profile || undefined} />}
    </div>
  );
}

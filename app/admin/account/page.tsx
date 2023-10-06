import EditForm from './EditForm';
import { notFound } from 'next/navigation';
import { getProfile } from 'lib/mongo';
import { getSession } from 'lib/session';
import { getMetadata } from '@/lib/helpers';

export const metadata = getMetadata({
  title: 'My Account',
});

export default async function Page() {
  const session = await getSession();
  if (!session) return notFound();
  const profile = await getProfile(session.profileId);
  if (!profile) notFound();

  return (
    <div className='mx-auto my-12 max-w-xl'>
      <h1 className=' text-2xl font-bold text-gray-600'>My Account</h1>
      <EditForm profile={profile} />
    </div>
  );
}

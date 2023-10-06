import JoinForm from './JoinForm';
import { notFound } from 'next/navigation';
import { getProfileByCode } from 'lib/mongo';
import { getMetadata } from '@/lib/helpers';
import PageWrapper from '../../PageWrapper';

export const metadata = getMetadata({
  title: 'Accept Invite',
});

type Props = {
  params: {
    inviteCode: string;
  };
};

export default async function Page({ params }: Props) {
  const inviteCode = params.inviteCode;
  const profile = await getProfileByCode(inviteCode);
  if (!profile) notFound();

  return (
    <PageWrapper heading='Set Password'>
      <JoinForm email={profile.email} inviteCode={inviteCode} />
    </PageWrapper>
  );
}

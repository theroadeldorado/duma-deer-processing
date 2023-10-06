import EditForm from './EditForm';
import { notFound } from 'next/navigation';
import { getEmailTemplate } from 'lib/mongo';
import { getMetadata } from '@/lib/helpers';

export const metadata = getMetadata({
  title: 'Edit Email Template',
});

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const id = params.id;

  const data = await getEmailTemplate(id);
  if (!data) notFound();

  return (
    <div className='mx-auto my-12 max-w-xl'>
      <h1 className='text-2xl font-bold text-gray-600'>Edit Email Template</h1>
      <EditForm data={data || undefined} />
    </div>
  );
}

import Link from 'next/link';
import { getMetadata } from '@/lib/helpers';

export const metadata = getMetadata({
  title: 'Admin',
});

export default function Page() {
  return <Link href='/admin/users'>Users</Link>;
}

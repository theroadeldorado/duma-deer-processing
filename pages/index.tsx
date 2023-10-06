import Link from 'next/link';
import getSecureServerSideProps from '@/lib/getSecureServerSideProps';

export default function UserDashboard() {
  return (
    <div>
      <h1 className='text-4xl font-bold'>User Dashboard</h1>
    </div>
  );
}

export const getServerSideProps = getSecureServerSideProps(() => ({ props: {} }));

import React from 'react';
import AdminPage from '@/components/layouts/Admin';
import getSecureServerSideProps from 'lib/getSecureServerSideProps';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <AdminPage title='Admin Dashboard'>
      <h1 className='text-4xl mb-6 font-bold'>Admin Dashboard</h1>
      <Link href='/admin/deers' className='font-bold text-green'>
        Deers
      </Link>{' '}
      |{' '}
      <Link href='/admin/users' className='font-bold text-green'>
        Users
      </Link>{' '}
      |{' '}
      {/* <Link href='/admin/templates' className='font-bold text-green'>
        Email Templates
      </Link> */}
    </AdminPage>
  );
}

export const getServerSideProps = getSecureServerSideProps(() => ({ props: {} }), true);

import React from 'react';
import AdminPage from '@/components/layouts/Admin';
import getSecureServerSideProps from 'lib/getSecureServerSideProps';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <AdminPage title='Admin Dashboard'>
      <h1 className='mb-6 text-4xl font-bold'>Admin Dashboard</h1>
      <Link href='/admin/users' className='font-bold text-blue-600'>
        Users
      </Link>{' '}
      |{' '}
      <Link href='/admin/templates' className='font-bold text-blue-600'>
        Email Templates
      </Link>
    </AdminPage>
  );
}

export const getServerSideProps = getSecureServerSideProps(() => ({ props: {} }), true);

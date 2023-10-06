import React from 'react';
import { getMetadata } from '@/lib/helpers';
import UserTable from './UserTable';

export const metadata = getMetadata({
  title: 'Users',
});

export default function Page() {
  return (
    <>
      <h1 className=' mb-8 text-2xl font-bold text-gray-600'>Users</h1>
      <UserTable />
    </>
  );
}

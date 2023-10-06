import React from 'react';
import { getMetadata } from '@/lib/helpers';
import TemplatesTable from './TemplatesTable';

export const metadata = getMetadata({
  title: 'Email Templates',
});

export default function Page() {
  return (
    <>
      <h1 className=' mb-8 text-2xl font-bold text-gray-600'>Email Templates</h1>
      <TemplatesTable />
    </>
  );
}

import React from 'react';
import Link from 'next/link';
import { EmailTemplateT } from 'lib/types';
import Button from '@/components/Button';
import { Cell } from 'components/Table';

type Props = {
  data?: EmailTemplateT; // Make data optional
};

export default function TemplatesTableRow({ data }: Props) {
  // Check if data is available
  if (!data) {
    // Return null or some placeholder if data is not available
    return null;
  }

  const { _id, name, description } = data;

  return (
    <tr>
      <Cell>
        <Link href={`/admin/templates/${_id}/edit`} className='hover: text-gray-700'>
          {name}
        </Link>
      </Cell>
      <Cell>{description}</Cell>
      <Cell className='flex justify-end gap-4'>
        <Button href={`/admin/templates/${_id}/edit`} color='gray' size='sm'>
          Edit
        </Button>
      </Cell>
    </tr>
  );
}

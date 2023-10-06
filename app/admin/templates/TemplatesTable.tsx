'use client';

import Form from '@/components/Form';
import Input from '@/components/Input';
import { debounce } from '@/lib/helpers';
import { Table } from 'components/Table';
import useTableSearch from 'hooks/useTableSearch';
import { EmailTemplateT } from 'lib/types';
import { useForm } from 'react-hook-form';
import TableRow from './TableRow';

const cols = [
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'actions', label: '', sortable: false },
];

const TemplatesTable = () => {
  const { results, tableProps, updateFilters } = useTableSearch<EmailTemplateT>({
    url: '/api/email-templates',
    defaultFilters: { status: 'both' },
    defaultSortBy: 'name',
    defaultSortDir: 'asc',
  });

  const form = useForm<any>();

  const handleFilterUpdate = () => {
    const data = form.getValues();
    updateFilters(data);
  };

  const handleSearch = debounce(handleFilterUpdate, 500);

  return (
    <div>
      <Form form={form} onSubmit={() => null} className='flex flex-col gap-4 lg:flex-row'>
        <Input type='search' name='search' placeholder='Search' onChange={handleSearch} className='min-w-[250px]' />
      </Form>

      <Table cols={cols} {...tableProps}>
        {results.map((data) => (
          <TableRow key={data._id} data={data} />
        ))}
      </Table>
    </div>
  );
};

export default TemplatesTable;

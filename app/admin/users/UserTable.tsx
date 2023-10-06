'use client';
import React from 'react';
import { ProfileT } from 'lib/types';
import { Table } from 'components/Table';
import useTableSearch from 'hooks/useTableSearch';
import { useForm } from 'react-hook-form';
import Form from '@/components/Form';
import Input from '@/components/Input';
import SelectRole from '@/components/SelectRole';
import Icon from '@/components/Icon';
import Button from 'components/Button';
import { debounce } from '@/lib/helpers';
import TableRow from './TableRow';

const cols = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'createdAt', label: 'Signup Date' },
  { id: 'actions', label: '', sortable: false },
];

export default function UserTable() {
  const { results, tableProps, updateFilters, onExport } = useTableSearch<ProfileT>({
    url: '/api/users',
    defaultFilters: { status: 'both' },
    defaultSortBy: 'createdAt',
  });

  const form = useForm<any>();

  const handleFilterUpdate = () => {
    const data = form.getValues();
    updateFilters(data);
  };

  const handleSearch = debounce(handleFilterUpdate, 500);

  return (
    <>
      <Form form={form} onSubmit={() => null} className='flex flex-col gap-4 lg:flex-row'>
        <Input type='search' name='search' placeholder='Search' onChange={handleSearch} className='min-w-[250px]' />
        <SelectRole name='role' onChange={handleFilterUpdate} placeholder='Role' isClearable className='min-w-[8rem]' entity='org' />
        <Button type='button' onClick={onExport} className='gap-2 lg:ml-auto' color='default'>
          <Icon name='download' />
          Export
        </Button>
        <Button href='/admin/users/new/edit' color='primary' className='gap-2'>
          <Icon name='plus' />
          Add User
        </Button>
      </Form>

      <Table cols={cols} {...tableProps}>
        {results.map((data) => (
          <TableRow key={data._id} data={data} />
        ))}
      </Table>
    </>
  );
}

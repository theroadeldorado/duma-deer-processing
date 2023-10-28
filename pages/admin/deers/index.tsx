import React from 'react';
import AdminPage from '@/components/layouts/Admin';
import getSecureServerSideProps from 'lib/getSecureServerSideProps';
import { Table } from 'components/Table';
import useTableSearch from 'hooks/useTableSearch';
import Button from 'components/Button';
import { useForm } from 'react-hook-form';
import Form from '@/components/Form';
import Input from '@/components/Input';
import Icon from '@/components/Icon';
import { debounce } from '@/lib/helpers';
import { DeerDropOffT } from 'lib/types';
import DeerTableRow from './DeerTableRow';

const cols = [
  { id: 'createdAt', label: 'Submitted' },
  { id: 'name', label: 'Name' },
  { id: 'phone', label: 'Phone' },
  { id: 'tagNumber', label: 'Tag Number' },
  { id: 'address', label: 'Address' },
  { id: 'city', label: 'City' },
  { id: 'state', label: 'State' },
  { id: 'zip', label: 'Zip' },
  { id: 'communicationPreference', label: 'Communication Preference' },
  { id: 'actions', label: '', sortable: false },
];

export default function Deers() {
  const { results, tableProps, updateFilters, onExport } = useTableSearch<DeerDropOffT>({
    url: '/api/deers',
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
    <AdminPage title='Deers'>
      <Form form={form} onSubmit={() => null} className='flex flex-col gap-4 lg:flex-row'>
        <Input type='search' name='search' placeholder='Search' onChange={handleSearch} className='min-w-[250px]' />
        <Button type='button' onClick={onExport} className='gap-2 lg:ml-auto' color='default'>
          <Icon name='download' />
          Export
        </Button>
        <Button href='/admin/deers/new/edit' color='primary' className='gap-2'>
          <Icon name='plus' />
          Add Deer
        </Button>
      </Form>

      <Table cols={cols} {...tableProps}>
        {results.map((data) => (
          <DeerTableRow key={data.tagNumber} data={data} />
        ))}
      </Table>
    </AdminPage>
  );
}

export const getServerSideProps = getSecureServerSideProps(() => ({ props: {} }), true);

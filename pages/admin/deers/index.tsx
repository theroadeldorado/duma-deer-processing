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
import { DeerT } from 'lib/types';
import DeerTableRow from './DeerTableRow';
import { useUser } from '@/providers/UserProvider';
import clsx from 'clsx';

const cols = [
  { id: 'createdAt', label: 'Submitted' },
  { id: 'name', label: 'Name' },
  { id: 'phone', label: 'Phone' },
  { id: 'communication', label: 'Com Pref' },
  { id: 'address', label: 'Address' },
  { id: 'city', label: 'City' },
  { id: 'state', label: 'State' },
  { id: 'zip', label: 'Zip' },
  { id: 'tagNumber', label: 'Tag Number' },
  // { id: 'amountPaid', label: 'Amount Paid' },
  { id: 'totalAmount', label: 'Total' },
  { id: 'hasPrinted', label: 'Printed' },
  { id: 'actions', label: '', sortable: false },
];

export default function Deers() {
  const { name, email, profileId } = useUser();
  const { results, tableProps, updateFilters, onExport } = useTableSearch<DeerT>({
    url: '/api/deers',
    defaultFilters: { status: 'both' },
    defaultSortBy: 'createdAt',
  });

  const form = useForm<any>();

  const handleFilterUpdate = () => {
    const data = form.getValues();
    updateFilters(data);
  };

  const isSuperAdmin = profileId === '652006a63e37d2edd04bf2ee' || profileId === '654e4c0ecbc9f6187296c9a3';

  const handleSearch = debounce(handleFilterUpdate, 300);

  return (
    <AdminPage title='Deers'>
      <Form form={form} onSubmit={() => null} className='flex flex-col gap-4 lg:flex-row'>
        <Input type='search' name='search' placeholder='Search' onChange={handleSearch} className='min-w-[250px]' />
        {isSuperAdmin && (
          <Button type='button' onClick={onExport} className='gap-2 lg:ml-auto' color='default'>
            <Icon name='download' />
            Export
          </Button>
        )}
        <Button href='/admin/deers/new/edit' color='primary' className={clsx(!isSuperAdmin && 'lg:ml-auto', 'gap-2')}>
          <Icon name='plus' />
          Add Deer
        </Button>
      </Form>

      <Table cols={cols} {...tableProps}>
        {results.map((data) => (data ? <DeerTableRow key={data._id} data={data} /> : null))}
      </Table>
    </AdminPage>
  );
}

export const getServerSideProps = getSecureServerSideProps(() => ({ props: {} }), true);

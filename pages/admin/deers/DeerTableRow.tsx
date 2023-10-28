import React from 'react';
import Link from 'next/link';
import { DeerDropOffT } from 'lib/types';
import { truncate } from 'lib/helpers';
import { Cell } from 'components/Table';
import { Menu } from '@headlessui/react';
import dayjs from 'dayjs';
import Icon from '@/components/Icon';
import useMutation from 'hooks/useMutation';
import { useModal } from '@/providers/ModalProvider';
import { Float } from '@headlessui-float/react';
import { useQueryClient } from '@tanstack/react-query';
import Button from '@/components/Button';

type Props = {
  data: DeerDropOffT;
};

export default function DeerTableRow({ data }: Props) {
  const { name, tagNumber, address, city, state, zip, phone, communicationPreference, createdAt } = data;
  const { open } = useModal();
  const queryClient = useQueryClient();

  const del = useMutation({
    url: `/api/deer/${tagNumber}/delete`,
    method: 'DELETE',
    successMessage: 'User deleted successfully',
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/deer']);
    },
  });

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this user?')) return;
    del.mutate({});
  };

  return (
    <tr key={tagNumber}>
      {/* <Cell>
        <Link href={`/admin/deer/${tagNumber}/edit`} className='text-gray-700 hover:text-primary-blue'>
          {truncate(name, 32)}
        </Link>
      </Cell> */}
      <Cell suppressHydrationWarning>{createdAt && dayjs(createdAt).format('M/D/YY')}</Cell>
      <Cell>{name}</Cell>
      <Cell>{phone}</Cell>
      <Cell>{tagNumber}</Cell>
      <Cell>{address}</Cell>
      <Cell>{city}</Cell>
      <Cell>{state}</Cell>
      <Cell>{zip}</Cell>
      <Cell>{communicationPreference}</Cell>

      <Cell className='flex justify-end gap-4'>
        <Button>View Details</Button>
        <Menu as='div' className='relative'>
          <Float
            portal
            placement='bottom-end'
            offset={20}
            enter='transition duration-200 ease-out'
            enterFrom='scale-95 opacity-0'
            enterTo='scale-100 opacity-100'
            leave='transition duration-150 ease-in'
            leaveFrom='scale-100 opacity-100'
            leaveTo='scale-95 opacity-0'
          >
            <Menu.Button className='ml-2 flex items-center justify-center rounded-lg border border-gray-50 bg-gray-50 px-[0.875rem] py-2 text-sm font-semibold text-gray-800 hover:border-gray-100 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100'>
              Manage
              <Icon name='angleDown' className='text-base -mr-0.5 ml-1.5' />
            </Menu.Button>

            <Menu.Items className='z-10 w-[180px] rounded bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5'>
              <Menu.Item>
                <Link href={`/admin/deer/${tagNumber}/edit`} className='block px-4 py-2 text-sm text-gray-700 hover: hover:bg-gray-100'>
                  <Icon name='edit' className='inline-block mr-2' />
                  Edit
                </Link>
              </Menu.Item>

              <Menu.Item>
                <button
                  type='button'
                  onClick={() => deleteUser(tagNumber)}
                  className='block w-full px-4 py-2 text-sm text-left text-red-700 hover:bg-gray-100 hover:text-red-900'
                  disabled={del.isLoading}
                >
                  <Icon name='delete' className='inline-block mr-2' />
                  Delete
                </button>
              </Menu.Item>
            </Menu.Items>
          </Float>
        </Menu>
      </Cell>
    </tr>
  );
}

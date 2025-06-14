import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { DeerT } from 'lib/types';
import { Cell } from 'components/Table';
import { Menu } from '@headlessui/react';
import dayjs from 'dayjs';
import Icon from '@/components/Icon';
import useMutation from 'hooks/useMutation';
import { Float } from '@headlessui-float/react';
import { useQueryClient } from '@tanstack/react-query';
import Button from '@/components/Button';
import Summary from '@/components/Summary';
import Modal from '@/components/Modal';
import PrintDeerDetails from '@/components/PrintDeerDetails';
import clsx from 'clsx';

type Props = {
  data: DeerT | null;
};

export default function DeerTableRow({ data }: Props) {
  const mutation = useMutation({
    url: `/api/deers/${data?._id}/update`, // adjust the URL as necessary
    method: 'PUT',
    successMessage: 'Deer updated successfully',
    onSuccess: () => {
      // any success logic, like refreshing data or redirecting
    },
  });
  const [hasPrinted, setHasPrinted] = useState(data?.hasPrinted === 'true');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [printId, setPrintId] = useState(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const del = useMutation({
    url: `/api/deers/${data?._id}/delete`,
    method: 'DELETE',
    successMessage: 'Deer deleted successfully',
    onSuccess: () => {
      router.push('/admin/deers');
    },
  });

  // Early return if data is not available.
  if (!data) {
    return null;
  }

  const { _id, name, tagNumber, address, city, state, zip, phone, communication, createdAt, amountPaid, totalPrice } = data;

  const deleteDeer = async (id: string) => {
    if (!data?._id) {
      console.error('No deer ID available for deletion');
      return;
    }
    if (!confirm('Are you sure you want to permanently delete entry?')) return;
    del.mutate({});
  };

  const handleViewDetails = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handlePrintDetails = (id: any) => {
    setPrintId(id);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  window.onafterprint = () => {
    setPrintId(null);
  };

  const handleHasPrintedChange = async (isChecked: boolean) => {
    // Convert boolean to 'true' or 'false' string
    const hasPrintedValue = isChecked ? 'true' : 'false';
    setHasPrinted(isChecked);

    // Update local state or form state as necessary
    // ... your code to update local state/form

    // Prepare the data payload for updating
    const updatedData = {
      ...data, // spread the existing data
      hasPrinted: hasPrintedValue, // update the hasPrinted field
    };

    // Send update request to your API
    mutation.mutate(updatedData);
  };

  return (
    <>
      <tr key={_id} className='transition-colors duration-200 ease-in-out hover:bg-slate-100'>
        <Cell suppressHydrationWarning>{createdAt && dayjs(createdAt).format('M/D/YY  h:mm A')}</Cell>
        <Cell>{name}</Cell>
        <Cell>{phone}</Cell>
        <Cell>{communication}</Cell>
        <Cell>{address}</Cell>
        <Cell>{city}</Cell>
        <Cell>{state}</Cell>
        <Cell>{zip}</Cell>
        <Cell>{tagNumber}</Cell>
        {/* <Cell
          className={clsx({
            'font-bold !text-[#008000]': amountPaid && totalPrice && amountPaid === totalPrice,
            'font-bold !text-red-500': amountPaid && totalPrice && amountPaid < totalPrice,
          })}
        >
          {amountPaid ? `$${amountPaid.toFixed(2)}` : '$0.00'}
        </Cell> */}
        <Cell className='font-bold'>{totalPrice ? `$${totalPrice.toFixed(2)}` : 'NA'}</Cell>
        <Cell>
          <div className='hs-tooltip flex items-center'>
            <input
              type='checkbox'
              id='hasPrintedInput'
              checked={hasPrinted}
              onChange={(e) => handleHasPrintedChange(e.target.checked)}
              className='relative h-7 w-[3.25rem] cursor-pointer rounded-full border-transparent bg-gray-300 !bg-none p-px text-transparent transition-colors duration-200 ease-in-out before:inline-block before:h-6 before:w-6 before:translate-x-0 before:transform before:rounded-full before:bg-white before:shadow before:ring-0 before:transition before:duration-200 before:ease-in-out checked:border-primary-blue checked:bg-primary-blue checked:text-primary-blue checked:before:translate-x-full focus:ring-primary-blue focus:checked:border-primary-blue disabled:pointer-events-none disabled:opacity-50'
            />
          </div>
        </Cell>

        <Cell className='flex justify-end gap-4'>
          <Button onClick={() => handlePrintDetails(`${data._id}`)}>
            <span className='sr-only'>Print Details</span>
            <svg xmlns='http://www.w3.org/2000/svg' className='w-5' viewBox='0 0 512 512'>
              <path
                fill='white'
                d='M96 160H64V64C64 28.7 92.7 0 128 0H357.5c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 18.7 28.3 18.7 45.3V160H416V90.5c0-8.5-3.4-16.6-9.4-22.6L380.1 41.4c-6-6-14.1-9.4-22.6-9.4H128c-17.7 0-32 14.3-32 32v96zm352 64H64c-17.7 0-32 14.3-32 32V384H64V352c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32v32h32V256c0-17.7-14.3-32-32-32zm0 192v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V416H32c-17.7 0-32-14.3-32-32V256c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64V384c0 17.7-14.3 32-32 32H448zM96 352l0 128H416V352H96zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z'
              />
            </svg>
          </Button>
          <Button onClick={handleViewDetails}>View Details</Button>
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
              <Menu.Button className='ml-2 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-200 px-[0.875rem] py-2 text-sm font-semibold text-gray-800 hover:border-gray-300 hover:bg-gray-300 focus:ring-4 focus:ring-gray-100'>
                Manage
                <Icon name='angleDown' className='text-base -mr-0.5 ml-1.5' />
              </Menu.Button>

              <Menu.Items className='z-10 w-[180px] rounded bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5'>
                <Menu.Item>
                  <Link href={`/admin/deers/${_id}/edit`} className='hover: block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                    <Icon name='edit' className='mr-2 inline-block' />
                    Edit
                  </Link>
                </Menu.Item>

                <Menu.Item>
                  <button
                    type='button'
                    onClick={() => deleteDeer(`${data._id}`)}
                    disabled={del.isLoading}
                    className='block w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-gray-100 hover:text-red-900'
                  >
                    <Icon name='delete' className='mr-2 inline-block' />
                    Delete
                  </button>
                </Menu.Item>
              </Menu.Items>
            </Float>
          </Menu>
        </Cell>
      </tr>
      <tr className='!border-0'>
        <td colSpan={100}>
          <span
            className={clsx(printId === data?._id ? 'pointer-events-none fixed left-0 top-0 block bg-white opacity-0 print:opacity-100' : 'hidden')}
          >
            <PrintDeerDetails data={data} />
          </span>
          <Modal isVisible={isModalVisible} onClose={handleCloseModal}>
            <Summary formValues={data} />
          </Modal>
        </td>
      </tr>
    </>
  );
}

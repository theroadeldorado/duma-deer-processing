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
import { useQueryClient, useQuery } from '@tanstack/react-query';
import Button from '@/components/Button';
import Summary from '@/components/Summary';
import Modal from '@/components/Modal';
import PrintDeerDetails from '@/components/PrintDeerDetails';
import PrintShoulderMountDetails from '@/components/PrintShoulderMountDetails';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import Form from '@/components/Form';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Select from '@/components/Select';
import { calculateCapeHideTotal, getCapeHideTotalForDisplay } from 'lib/priceCalculations';

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
  const [isMountModalVisible, setIsMountModalVisible] = useState(false);
  const [printId, setPrintId] = useState<string | null>(null);
  const [mountPrintId, setMountPrintId] = useState<string | null>(null);
  const [shouldPrintAfterSave, setShouldPrintAfterSave] = useState(false);
  const [updatedMountData, setUpdatedMountData] = useState({
    shoulderMountHeadPosition: data?.shoulderMountHeadPosition,
    shoulderMountEarPosition: data?.shoulderMountEarPosition,
    shoulderMountSpecialInstructions: data?.shoulderMountSpecialInstructions,
    hideCondition: data?.hideCondition,
    facialFeatures: data?.facialFeatures,
    deposit: data?.deposit,
    capeHideDeposit: data?.capeHideDeposit,
    capeHideTotal: data?.capeHideTotal,
    rackId: data?.rackId,
    capeId: data?.capeId,
    capeMorseCode: data?.capeMorseCode,
    approxNeckMeasurement: data?.approxNeckMeasurement,
    formOrdered: data?.formOrdered,
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  // Query to fetch updated deer data for printing (using the existing deers endpoint)
  const { refetch: refetchDeer } = useQuery({
    queryKey: ['deer', data?._id],
    queryFn: async () => {
      const response = await fetch('/api/deers');
      const result = await response.json();
      return result.results?.find((deer: DeerT) => deer._id === data?._id);
    },
    enabled: false, // Only fetch when explicitly triggered
  });

  // Form for mount details
  const mountForm = useForm({
    defaultValues: {
      shoulderMountHeadPosition: data?.shoulderMountHeadPosition || '',
      shoulderMountEarPosition: data?.shoulderMountEarPosition || '',
      shoulderMountSpecialInstructions: data?.shoulderMountSpecialInstructions || '',
      hideCondition: data?.hideCondition || '',
      facialFeatures: data?.facialFeatures || '',
      capeHideDeposit: data?.capeHideDeposit || '',
      rackId: data?.rackId || '',
      capeId: data?.capeId || '',
      capeMorseCode: data?.capeMorseCode || '',
      approxNeckMeasurement: data?.approxNeckMeasurement || '',
      formOrdered: data?.formOrdered || '',
    },
  });

  const mountMutation = useMutation({
    url: `/api/deers/${data?._id}/update`,
    method: 'PUT',
    successMessage: 'Mount details updated successfully',
    onSuccess: async (response, variables) => {
      setIsMountModalVisible(false);

      // If we should print after save, refetch data first
      if (shouldPrintAfterSave) {
        setShouldPrintAfterSave(false);

        try {
          // Invalidate the deers query to force a refetch
          await queryClient.invalidateQueries(['deers']);

          // Wait for the invalidation to trigger a refetch, then refetch our specific deer
          await queryClient.refetchQueries(['deers']);

          // Small delay to ensure data is fully updated
          await new Promise((resolve) => setTimeout(resolve, 300));

          // Refetch the specific deer data
          const result = await refetchDeer();

          if (result.data) {
            // Update local state with fresh data
            setUpdatedMountData({
              shoulderMountHeadPosition: result.data.shoulderMountHeadPosition,
              shoulderMountEarPosition: result.data.shoulderMountEarPosition,
              shoulderMountSpecialInstructions: result.data.shoulderMountSpecialInstructions,
              hideCondition: result.data.hideCondition,
              facialFeatures: result.data.facialFeatures,
              deposit: result.data.deposit,
              capeHideDeposit: result.data.capeHideDeposit,
              capeHideTotal: result.data.capeHideTotal,
              rackId: result.data.rackId,
              capeId: result.data.capeId,
              capeMorseCode: result.data.capeMorseCode,
              approxNeckMeasurement: result.data.approxNeckMeasurement,
              formOrdered: result.data.formOrdered,
            });
          }

          // Trigger print after data is refreshed
          setTimeout(() => {
            setMountPrintId(data?._id ?? null);
            setTimeout(() => {
              window.print();
            }, 100);
          }, 100);
        } catch (error) {
          console.error('Failed to refetch deer data:', error);
          // Fallback to print with current data
          setTimeout(() => {
            setMountPrintId(data?._id ?? null);
            setTimeout(() => {
              window.print();
            }, 100);
          }, 100);
        }
      } else {
        // Regular save without print
        queryClient.invalidateQueries(['deers']);
      }
    },
  });
  const del = useMutation({
    url: `/api/deers/${encodeURIComponent(data?._id || '')}/delete`,
    method: 'DELETE',
    successMessage: 'Deer deleted successfully',
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(['deers']);

      // Snapshot the previous value
      const previousDeers = queryClient.getQueryData(['deers']);

      // Optimistically update to remove the deer
      queryClient.setQueryData(['deers'], (old: any) => {
        if (!old?.results) return old;
        return {
          ...old,
          results: old.results.filter((deer: DeerT) => deer._id !== data?._id),
        };
      });

      // Return a context object with the snapshotted value
      return { previousDeers };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      const typedContext = context as { previousDeers?: any } | undefined;
      if (typedContext?.previousDeers) {
        queryClient.setQueryData(['deers'], typedContext.previousDeers);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have correct data
      queryClient.invalidateQueries(['deers']);
    },
  });

  // Early return if data is not available.
  if (!data) {
    return null;
  }

  const { _id, name, tagNumber, address, city, state, zip, phone, communication, createdAt, amountPaid, totalPrice } = data;

  const deleteDeer = async (id: string) => {
    if (!data?._id) return;
    if (!confirm('Are you sure you want to permanently delete entry?')) return;
    del.mutate(null);
  };

  const handleViewDetails = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleMountModal = () => {
    setIsMountModalVisible(true);
  };

  const handleCloseMountModal = () => {
    setIsMountModalVisible(false);
    // Reset form to original values
    mountForm.reset({
      shoulderMountHeadPosition: data?.shoulderMountHeadPosition || '',
      shoulderMountEarPosition: data?.shoulderMountEarPosition || '',
      shoulderMountSpecialInstructions: data?.shoulderMountSpecialInstructions || '',
      hideCondition: data?.hideCondition || '',
      facialFeatures: data?.facialFeatures || '',
      capeHideDeposit: data?.capeHideDeposit || '',
      rackId: data?.rackId || '',
      capeId: data?.capeId || '',
      capeMorseCode: data?.capeMorseCode || '',
      approxNeckMeasurement: data?.approxNeckMeasurement || '',
      formOrdered: data?.formOrdered || '',
    });
  };

  const handleMountSave = (formData: any) => {
    // Parse capeHideDeposit as a number
    const capeHideDepositValue = formData.capeHideDeposit && formData.capeHideDeposit !== '' ? Number(formData.capeHideDeposit) : undefined;

    // Create an object with all the mount-related fields
    const mountData = {
      shoulderMountHeadPosition: formData.shoulderMountHeadPosition,
      shoulderMountEarPosition: formData.shoulderMountEarPosition,
      shoulderMountSpecialInstructions: formData.shoulderMountSpecialInstructions,
      hideCondition: formData.hideCondition,
      facialFeatures: formData.facialFeatures,
      deposit: data?.deposit, // Include deposit to satisfy TypeScript
      capeHideDeposit: capeHideDepositValue, // Explicitly convert to number
      // PRESERVE historical pricing - only calculate if no stored value exists
      capeHideTotal: data?.capeHideTotal !== undefined && data?.capeHideTotal !== null ? data.capeHideTotal : calculateCapeHideTotal(data),
      // PRESERVE historical item prices
      historicalItemPrices: data?.historicalItemPrices,
      // PRESERVE complete pricing snapshot
      pricingSnapshot: data?.pricingSnapshot,
      rackId: formData.rackId,
      capeId: formData.capeId,
      capeMorseCode: formData.capeMorseCode,
      approxNeckMeasurement:
        formData.approxNeckMeasurement && formData.approxNeckMeasurement !== '' ? Number(formData.approxNeckMeasurement) : undefined,
      formOrdered: formData.formOrdered,
    };

    const updatedData = {
      ...data,
      ...mountData,
      deposit: data?.deposit, // Preserve the original deposit value
    };

    console.log('Saving mount data with capeHideDeposit:', capeHideDepositValue);

    // Store the updated mount data
    setUpdatedMountData(mountData);

    // Send the complete updated data to the server
    mountMutation.mutate(updatedData);
  };

  const handleMountSaveAndPrint = (formData: any) => {
    // Parse capeHideDeposit as a number
    const capeHideDepositValue = formData.capeHideDeposit && formData.capeHideDeposit !== '' ? Number(formData.capeHideDeposit) : undefined;

    // Create an object with all the mount-related fields
    const mountData = {
      shoulderMountHeadPosition: formData.shoulderMountHeadPosition,
      shoulderMountEarPosition: formData.shoulderMountEarPosition,
      shoulderMountSpecialInstructions: formData.shoulderMountSpecialInstructions,
      hideCondition: formData.hideCondition,
      facialFeatures: formData.facialFeatures,
      deposit: data?.deposit, // Include deposit to satisfy TypeScript
      capeHideDeposit: capeHideDepositValue, // Explicitly convert to number
      // PRESERVE historical pricing - only calculate if no stored value exists
      capeHideTotal: data?.capeHideTotal !== undefined && data?.capeHideTotal !== null ? data.capeHideTotal : calculateCapeHideTotal(data),
      // PRESERVE historical item prices
      historicalItemPrices: data?.historicalItemPrices,
      // PRESERVE complete pricing snapshot
      pricingSnapshot: data?.pricingSnapshot,
      rackId: formData.rackId,
      capeId: formData.capeId,
      capeMorseCode: formData.capeMorseCode,
      approxNeckMeasurement:
        formData.approxNeckMeasurement && formData.approxNeckMeasurement !== '' ? Number(formData.approxNeckMeasurement) : undefined,
      formOrdered: formData.formOrdered,
    };

    const updatedData = {
      ...data,
      ...mountData,
      deposit: data?.deposit, // Preserve the original deposit value
    };

    console.log('Saving and printing mount data with capeHideDeposit:', capeHideDepositValue);

    // Store the updated mount data for printing
    setUpdatedMountData(mountData);

    // Set flag to print after save
    setShouldPrintAfterSave(true);

    // Trigger the save with the complete updated data
    mountMutation.mutate(updatedData);
  };

  const handlePrintDetails = (id: any) => {
    setPrintId(id);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handlePrintMountDetails = (id: any) => {
    setMountPrintId(id);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  window.onafterprint = () => {
    setPrintId(null);
    setMountPrintId(null);
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
        <Cell className='font-bold'>{`$${(getCapeHideTotalForDisplay(data) + (totalPrice || 0)).toFixed(2)}`}</Cell>
        <Cell>
          {/* Only show edit/print buttons for options that need separate printout (non-Take Today options) */}
          {data.cape === 'Shoulder mount' ||
          data.hide === 'Tanned Hair on' ||
          (data.euroMount && (data.euroMount === 'Boiled finished mount' || data.euroMount === 'Beetles finished mount')) ? (
            <span className='flex items-center justify-center gap-2'>
              <Button onClick={handleMountModal} className='bg-red-500 text-white hover:bg-red-600'>
                <span className='sr-only'>Edit Mount Details</span>
                <Icon name='edit' className='h-4 w-4' />
              </Button>
              <Button onClick={() => handlePrintMountDetails(`${data._id}`)} className='bg-red-500 text-white hover:bg-red-600'>
                <span className='sr-only'>Print Mount Details</span>
                <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' viewBox='0 0 512 512'>
                  <path
                    fill='white'
                    d='M96 160H64V64C64 28.7 92.7 0 128 0H357.5c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 18.7 28.3 18.7 45.3V160H416V90.5c0-8.5-3.4-16.6-9.4-22.6L380.1 41.4c-6-6-14.1-9.4-22.6-9.4H128c-17.7 0-32 14.3-32 32v96zm352 64H64c-17.7 0-32 14.3-32 32V384H64V352c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32v32h32V256c0-17.7-14.3-32-32-32zm0 192v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V416H32c-17.7 0-32-14.3-32-32V256c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64V384c0 17.7-14.3 32-32 32H448zM96 352l0 128H416V352H96zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z'
                  />
                </svg>
              </Button>
            </span>
          ) : (
            <span className='inline-block w-full text-center text-sm '>N/A</span>
          )}
        </Cell>
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

        <Cell>
          <span className='flex justify-end gap-4'>
            <Button onClick={() => handlePrintDetails(`${data._id}`)}>
              <span className='sr-only'>Print Details</span>
              <svg xmlns='http://www.w3.org/2000/svg' className='w-5' viewBox='0 0 512 512'>
                <path
                  fill='white'
                  d='M96 160H64V64C64 28.7 92.7 0 128 0H357.5c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 18.7 28.3 18.7 45.3V160H416V90.5c0-8.5-3.4-16.6-9.4-22.6L380.1 41.4c-6-6-14.1-9.4-22.6-9.4H128c-17.7 0-32 14.3-32 32v96zm352 64H64c-17.7 0-32 14.3-32 32V384H64V352c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32v32h32V256c0-17.7-14.3-32-32-32zm0 192v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V416H32c-17.7 0-32-14.3-32-32V256c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64V384c0 17.7-14.3 32-32 32H448zM96 352l0 128H416V352H96zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z'
                />
              </svg>
            </Button>
            <Button onClick={handleViewDetails}>Preview</Button>
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
          </span>
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

          <Modal isVisible={isMountModalVisible} onClose={handleCloseMountModal}>
            <div className='p-6'>
              <h3 className='mb-4 text-xl font-bold'>Edit Taxidermy Details</h3>

              {/* Service Types Summary */}
              <div className='mb-6'>
                <h4 className='font-bold'>Services Selected</h4>
                <div>
                  {(() => {
                    const services = [];
                    const isShoulderMount = data.cape === 'Shoulder mount';
                    const isEuroMount = data.euroMount && data.euroMount !== 'false' && data.euroMount !== '' && data.euroMount !== 'Keep head';
                    const isHideTanned = data.hide === 'Tanned Hair on';

                    if (isShoulderMount) services.push('Shoulder Mount');
                    if (isEuroMount) {
                      let euroMountType = 'Euro Mount';
                      if (data.euroMount === 'Beetles finished mount') {
                        euroMountType = 'Euro Mount - Beetle Finished';
                      } else if (data.euroMount === 'Boiled finished mount') {
                        euroMountType = 'Euro Mount - Boiled Finished';
                      }
                      services.push(euroMountType);
                    }
                    if (isHideTanned) services.push('Hide - Tanned Hair On');

                    if (services.length === 0) {
                      return <span className='italic text-gray-500'>No taxidermy services selected</span>;
                    }

                    return services.join(' • ');
                  })()}
                </div>
              </div>

              <Form form={mountForm} onSubmit={handleMountSave} className='space-y-4'>
                {/* Common fields for both Shoulder Mount and Tanned Hair on */}
                {data.euroMount && (data.euroMount === 'Boiled finished mount' || data.euroMount === 'Beetles finished mount') && (
                  <>
                    <div className='grid grid-cols-4 gap-4'>
                      <div>
                        <label className='mb-1 block text-sm font-medium text-gray-700'>Rack ID</label>
                        <Input
                          name='rackId'
                          type='text'
                          placeholder='Rack ID'
                          className='w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue'
                        />
                      </div>
                    </div>
                  </>
                )}
                {(data.cape === 'Shoulder mount' || data.hide === 'Tanned Hair on') && (
                  <>
                    <div className='grid grid-cols-4 gap-4'>
                      {/* Cape ID and Cape Morse Code for both Shoulder mount and Tanned Hair on */}
                      <div>
                        <label className='mb-1 block text-sm font-medium text-gray-700'>Cape ID</label>
                        <Input
                          name='capeId'
                          type='text'
                          placeholder='Cape ID'
                          className='w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue'
                        />
                      </div>
                      <div>
                        <label className='mb-1 block text-sm font-medium text-gray-700'>Cape Morse Code #</label>
                        <Input
                          name='capeMorseCode'
                          type='text'
                          placeholder='Cape Morse Code #'
                          className='w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue'
                        />
                      </div>

                      {/* Fields only for Shoulder mount */}
                      {data.cape === 'Shoulder mount' && (
                        <>
                          <div>
                            <label className='mb-1 block text-sm font-medium text-gray-700'>Rack ID</label>
                            <Input
                              name='rackId'
                              type='text'
                              placeholder='Rack ID'
                              className='w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue'
                            />
                          </div>
                          <div>
                            <label className='mb-1 block text-sm font-medium text-gray-700'>Approx Neck Measurement (inches)</label>
                            <Input
                              name='approxNeckMeasurement'
                              type='number'
                              step='0.1'
                              placeholder='0.0'
                              min={0}
                              className='w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue'
                              onChange={(e) => {
                                const numValue = e.target.value ? Number(e.target.value) : '';
                                mountForm.setValue('approxNeckMeasurement', numValue);
                              }}
                            />
                          </div>
                          <div>
                            <label className='mb-1 block text-sm font-medium text-gray-700'>Form Ordered</label>
                            <Input
                              name='formOrdered'
                              type='text'
                              placeholder='Form Ordered'
                              className='w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue'
                            />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Shoulder Mount specific fields */}
                    {data.cape === 'Shoulder mount' && (
                      <>
                        <div className='grid grid-cols-4 gap-4'>
                          <div className='col-span-2'>
                            <label className='mb-1 block text-sm font-medium text-gray-700'>Head position - deer faces from the wall</label>
                            <Select
                              className='w-full'
                              name='shoulderMountHeadPosition'
                              options={[
                                { value: '', label: 'Select Position' },
                                { value: 'Upright Left', label: 'Upright Left' },
                                { value: 'Upright Right', label: 'Upright Right' },
                                { value: 'Semi Upright Left', label: 'Semi Upright Left' },
                                { value: 'Semi Upright Right', label: 'Semi Upright Right' },
                                { value: 'Semi Sneak Left', label: 'Semi Sneak Left' },
                                { value: 'Semi Sneak Right', label: 'Semi Sneak Right' },
                              ]}
                            />
                          </div>
                          <div className='col-span-2'>
                            <label className='mb-1 block text-sm font-medium text-gray-700'>Ear Position</label>
                            <Select
                              className='w-full'
                              name='shoulderMountEarPosition'
                              options={[
                                { value: '', label: 'Select Position' },
                                { value: 'Forward', label: 'Forward' },
                                { value: 'Back', label: 'Back' },
                                { value: 'Rotated', label: 'Rotated' },
                              ]}
                            />
                          </div>
                        </div>

                        <div>
                          <label className='mb-1 block text-sm font-medium text-gray-700'>Facial Features/Coloring/Notches</label>
                          <Textarea
                            name='facialFeatures'
                            placeholder='Facial features, coloring, or notches...'
                            rows={2}
                            className='w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue'
                          />
                        </div>
                      </>
                    )}

                    {/* Hide condition field for both shoulder mount and tanned hide */}
                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>Hide Condition</label>
                      <Textarea
                        name='hideCondition'
                        placeholder='Gray marks, tick marks, scars, cut, etc...'
                        rows={2}
                        className='w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue'
                      />
                    </div>
                  </>
                )}

                {/* Special Instructions for all types */}
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>Special Instructions</label>
                  <Textarea
                    name='shoulderMountSpecialInstructions'
                    placeholder='Any special requests or specific pose instructions...'
                    rows={3}
                    className='w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue'
                  />
                </div>

                <div className='grid grid-cols-4 gap-4'>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>Taxidermy Deposit</label>
                    <Input
                      name='capeHideDeposit'
                      type='number'
                      step='0.01'
                      placeholder='0.00'
                      min={0}
                      className='w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue'
                      onChange={(e) => {
                        // Ensure the value is registered as a number
                        const numValue = e.target.value ? Number(e.target.value) : '';
                        mountForm.setValue('capeHideDeposit', numValue);
                      }}
                    />
                  </div>
                </div>
                {/* Summary section with totals and balance */}
                <div className='mt-6 border-t border-dashed border-gray-300 pt-4'>
                  <div className='flex flex-col items-end justify-end gap-2 text-right'>
                    <div>
                      <p className='font-bold'>Taxidermy Total: ${getCapeHideTotalForDisplay(data).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className='font-bold text-blue-600'>
                        Balance: ${(getCapeHideTotalForDisplay(data) - Number(mountForm.watch('capeHideDeposit') || 0)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='flex items-center justify-between pt-4'>
                  <Button
                    type='button'
                    onClick={() => {
                      // Get form data and print without validation
                      const formData = mountForm.getValues();
                      handleMountSaveAndPrint(formData);
                    }}
                    className='bg-red-500 text-white hover:bg-red-600'
                  >
                    <span className='sr-only'>Print Mount Details</span>
                    <svg xmlns='http://www.w3.org/2000/svg' className='mr-2 h-4 w-4' viewBox='0 0 512 512'>
                      <path
                        fill='white'
                        d='M96 160H64V64C64 28.7 92.7 0 128 0H357.5c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 18.7 28.3 18.7 45.3V160H416V90.5c0-8.5-3.4-16.6-9.4-22.6L380.1 41.4c-6-6-14.1-9.4-22.6-9.4H128c-17.7 0-32 14.3-32 32v96zm352 64H64c-17.7 0-32 14.3-32 32V384H64V352c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32v32h32V256c0-17.7-14.3-32-32-32zm0 192v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V416H32c-17.7 0-32-14.3-32-32V256c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64V384c0 17.7-14.3 32-32 32H448zM96 352l0 128H416V352H96zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z'
                      />
                    </svg>
                    Print
                  </Button>
                  <div className='flex gap-3'>
                    <Button type='button' onClick={handleCloseMountModal} color='default'>
                      Cancel
                    </Button>
                    <Button type='submit' color='primary' disabled={mountMutation.isLoading}>
                      {mountMutation.isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          </Modal>

          <span
            className={clsx(
              mountPrintId === data?._id ? 'pointer-events-none fixed left-0 top-0 block bg-white opacity-0 print:opacity-100' : 'hidden'
            )}
          >
            <PrintShoulderMountDetails data={{ ...data, ...updatedMountData }} />
          </span>
        </td>
      </tr>
    </>
  );
}

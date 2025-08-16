import React from 'react';
import { DeerT } from 'lib/types';
import clsx from 'clsx';
import dayjs from 'dayjs';

interface PrintShoulderMountDetailsProps {
  data: DeerT;
}

const PrintShoulderMountDetails: React.FC<PrintShoulderMountDetailsProps> = ({ data }) => {
  const renderContactInformation = () => {
    return (
      <div className='space-y-2'>
        <div className='text-xl font-bold'>{data.name}</div>
        <div className='text-lg font-bold'>{data.phone}</div>
        <div>{data.address}</div>
        <div>
          {data.city}, {data.state} {data.zip}
        </div>
        <div>Tag Number: {data.tagNumber}</div>
      </div>
    );
  };

  const renderMountDetails = () => {
    const mountDetails = [];

    if (data.shoulderMountHeadPosition) {
      mountDetails.push({
        label: 'Head Position',
        value: data.shoulderMountHeadPosition,
      });
    }

    if (data.shoulderMountEarPosition) {
      mountDetails.push({
        label: 'Ear Position',
        value: data.shoulderMountEarPosition,
      });
    }

    if (data.shoulderMountSpecialInstructions) {
      mountDetails.push({
        label: 'Special Instructions',
        value: data.shoulderMountSpecialInstructions,
      });
    }

    return mountDetails.map(({ label, value }, index) => (
      <div key={index} className='flex flex-col space-y-1'>
        <div className='text-lg font-bold'>{label}:</div>
        <div className='text-base'>{value}</div>
      </div>
    ));
  };

  return (
    <div className='print-container flex flex-col'>
      <div className='break-after-page bg-white'>
        <div className='aspect-[5/8] w-[720px] break-inside-avoid-page bg-white'>
          <div className='border-[6px] border-blue-500 p-2'>
            <h4 className='mb-2 font-bold'>{data.createdAt && dayjs(data.createdAt).format('M/D/YY  h:mm A')}</h4>
            <div className='border-b border-dashed border-gray-900 pb-3'>{renderContactInformation()}</div>
            <div className='gap-3'>
              <h4 className='my-4 text-xl font-bold'>Shoulder Mount Details</h4>
              <div className='grid grid-cols-1 gap-x-8 gap-y-4'>{renderMountDetails()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintShoulderMountDetails;

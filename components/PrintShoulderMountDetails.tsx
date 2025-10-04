import React from 'react';
import { DeerT } from 'lib/types';
import clsx from 'clsx';
import dayjs from 'dayjs';

interface PrintShoulderMountDetailsProps {
  data: DeerT;
}

const PrintShoulderMountDetails: React.FC<PrintShoulderMountDetailsProps> = ({ data }) => {
  // Determine which mount/hide options are selected
  const isShoulderMount = data.cape === 'Shoulder mount';
  const isEuroMount = data.euroMount && data.euroMount !== 'false' && data.euroMount !== '' && data.euroMount !== 'Keep head';
  const isHideTanned = data.hide === 'Tanned Hair on' && data.cape !== 'Take head';
  const showMountDetails = isShoulderMount || isEuroMount || isHideTanned;
  const renderContactInformation = () => {
    return (
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <div className='text-xl leading-[1.2]'>{data.name}</div>
          <div className='text-lg leading-[1.2]'>{data.phone}</div>
          <div className='text-lg leading-[1.2]'>Tag Number: {data.tagNumber}</div>
        </div>
        <div className='space-y-2'>
          {/* Cape ID and Cape Morse Code only for Shoulder Mount and Tanned Hair on */}
          {(isShoulderMount || isHideTanned) && (
            <>
              <div className='flex flex-col'>
                <div className='flex gap-1 text-lg leading-[1.2]'>
                  <span className='shrink-0 font-bold'>Cape ID:</span> <span className='grow border-b border-gray-900'>{data.capeId || ''}</span>
                </div>
              </div>
              <div className='flex flex-col'>
                <div className='flex gap-1 text-lg leading-[1.2]'>
                  <span className='shrink-0 font-bold'>Cape Morse Code #:</span>{' '}
                  <span className='grow border-b border-gray-900'>{data.capeMorseCode || ''}</span>
                </div>
              </div>
            </>
          )}

          {/* Rack ID for all mount types */}
          <div className='flex flex-col'>
            <div className='flex gap-1 text-lg leading-[1.2]'>
              <span className='shrink-0 font-bold'>Rack ID:</span> <span className='grow border-b border-gray-900'>{data.rackId || ''}</span>
            </div>
          </div>

          {/* Fields only for Shoulder mount */}
          {isShoulderMount && (
            <>
              <div className='flex flex-col'>
                <div className='flex gap-1 text-lg leading-[1.2]'>
                  <span className='shrink-0 font-bold'>Approx Neck Measurement:</span>{' '}
                  <span className='grow border-b border-gray-900'>{data.approxNeckMeasurement || ''}</span>
                </div>
              </div>
              <div className='flex flex-col'>
                <div className='flex gap-1 text-lg leading-[1.2]'>
                  <span className='shrink-0 font-bold'>Form Ordered:</span>{' '}
                  <span className='grow border-b border-gray-900'>{data.formOrdered || ''}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const termsRender = () => {
    return (
      <div className='col-span-3 flex flex-col'>
        <div className='shrink-0 font-bold'>Terms:</div>
        <div className='text-xs'>
          A deposit is required at drop-off, with the balance due before pickup. Completion times can vary depending on workload and seasonal demand,
          so no specific finish date is guaranteed. We are not responsible for hides, skulls, or antlers received in poor condition. Slippage may
          occur during tanning process. Finished work should be picked up within 30 days of notice, and all items are left at the customer’s own risk
          as we cannot be held liable for loss or damage beyond our control.
        </div>
      </div>
    );
  };

  const renderMountDetails = () => {
    // Base details for all mount types
    const mountDetails = [];

    // Add fields specific to shoulder mounts
    if (isShoulderMount) {
      mountDetails.push(
        {
          label: 'Head Position',
          value: data.shoulderMountHeadPosition || '',
          colspan: 1,
        },
        {
          label: 'Ear Position',
          value: data.shoulderMountEarPosition || (
            <span className='flex gap-8'>
              <span>Forward</span>
              <span>Back</span>
              <span>Rotated</span>
            </span>
          ),
          colspan: 1,
        },
        {
          label: 'Facial Features/Coloring/notches',
          value: data.facialFeatures || '',
          writeLines: 2,
        }
      );
    }

    // Add Hide Condition field for both shoulder mount and tanned hide
    if (isShoulderMount || isHideTanned) {
      mountDetails.push({
        label: 'Hide Condition',
        value: data.hideCondition || '',
        writeLines: 2,
      });
    }

    // Add fields for both shoulder mount and euro mount
    mountDetails.push({
      label: 'Special Instructions',
      value: data.shoulderMountSpecialInstructions || '',
      writeLines: 2,
    });

    return mountDetails.map(({ label, value, colspan, writeLines }, index) => (
      <div key={index} className={clsx('flex w-full gap-1 text-lg leading-[1.2]', colspan === 1 ? 'col-span-1' : 'col-span-2')}>
        <div className='flex w-full flex-col gap-1 text-lg leading-[1.2]'>
          <div className='w-full font-bold'>{label}:</div>
          <div className='min-h-4 w-full grow border-b border-gray-900'>{value || ''}</div>
          {writeLines && !value && (
            <>
              {Array.from({ length: writeLines }).map((_, index) => (
                <div key={index} className='h-5 w-full border-b border-gray-900'></div>
              ))}
            </>
          )}
        </div>
      </div>
    ));
  };

  const renderDepositAndBalance = () => {
    return (
      <div className='mt-8 grid grid-cols-3 gap-6'>
        <div className='flex flex-col'>
          <div className='flex gap-1 text-lg leading-[1.2]'>
            <span className='shrink-0 font-bold'>Deposit:</span>{' '}
            <span className='grow border-b border-gray-900'>{data.capeHideDeposit ? `$${Number(data.capeHideDeposit).toFixed(2)}` : ''}</span>
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='flex gap-1 text-lg leading-[1.2]'>
            <span className='shrink-0 font-bold'>Total:</span>{' '}
            <span className='grow border-b border-gray-900'>{data.capeHideTotal ? `$${Number(data.capeHideTotal).toFixed(2)}` : ''}</span>
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='flex gap-1 text-lg leading-[1.2]'>
            <span className='shrink-0 font-bold'>Balance:</span>{' '}
            <span className='grow border-b border-gray-900'>
              {data.capeHideTotal && data.capeHideDeposit ? `$${(Number(data.capeHideTotal) - Number(data.capeHideDeposit)).toFixed(2)}` : ''}
            </span>
          </div>
        </div>

        <div className='col-span-2 col-start-2 flex flex-col'>
          <div className='flex gap-1 text-lg leading-[1.2]'>
            <span className='shrink-0 font-bold'>Signature:</span> <span className='grow border-b border-gray-900'></span>
          </div>
        </div>
        {termsRender()}
      </div>
    );
  };

  const renderReceipt = () => {
    return (
      <div className={clsx(isEuroMount ? 'mt-56' : 'mt-8', 'grid grid-cols-3 gap-6 border-t border-dashed border-gray-900 pt-8')}>
        <div className='col-span-3 grid grid-cols-2 gap-2'>
          <div className='flex flex-col gap-2'>
            <div className='text-lg leading-[1.2]'>
              {data.name} - {data.phone}
            </div>
            <div className='text-lg leading-[1.2]'>Tag Number: {data.tagNumber}</div>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='text-lg font-bold leading-[1.2]'>
              {(() => {
                const services = [];
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
                if (isHideTanned) services.push('Hide');
                return services.join(' & ');
              })()}
            </div>
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='flex gap-1 text-lg leading-[1.2]'>
            <span className='shrink-0 font-bold'>Deposit:</span>{' '}
            <span className='grow border-b border-gray-900'>{data.capeHideDeposit ? `$${Number(data.capeHideDeposit).toFixed(2)}` : ''}</span>
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='flex gap-1 text-lg leading-[1.2]'>
            <span className='shrink-0 font-bold'>Total:</span>{' '}
            <span className='grow border-b border-gray-900'>{data.capeHideTotal ? `$${Number(data.capeHideTotal).toFixed(2)}` : ''}</span>
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='flex gap-1 text-lg leading-[1.2]'>
            <span className='shrink-0 font-bold'>Balance:</span>{' '}
            <span className='grow border-b border-gray-900'>
              {data.capeHideTotal && data.capeHideDeposit ? `$${(Number(data.capeHideTotal) - Number(data.capeHideDeposit)).toFixed(2)}` : ''}
            </span>
          </div>
        </div>
        {isEuroMount && data.euroMount === 'Boiled finished mount' && (
          <p className='col-span-3 text-xs'>Estimated pick up time: Boiled Heads pick up in March</p>
        )}
        {isEuroMount && data.euroMount === 'Beetles finished mount' && (
          <p className='col-span-3 text-xs'>Estimated pick up time: Beetled heads pick up in July</p>
        )}
        {termsRender()}
      </div>
    );
  };

  return (
    <div className='print-container flex flex-col'>
      <div className='break-after-page bg-white'>
        <div className='aspect-[5/8] w-[720px] break-inside-avoid-page bg-white'>
          <div
            className={clsx(
              'border-[6px] p-2',
              isEuroMount && data.euroMount === 'Boiled finished mount' && 'border-red-500',
              isEuroMount && data.euroMount !== 'Boiled finished mount' && 'border-black',
              !isEuroMount && 'border-blue-500'
            )}
          >
            <h4 className='mb-2 font-bold'>{data.createdAt && dayjs(data.createdAt).format('M/D/YY  h:mm A')}</h4>
            <div className='mb-3 border-b border-dashed border-gray-900 pb-3'>{renderContactInformation()}</div>
            <div className='gap-3'>
              <h4 className='my-4 text-xl font-bold'>
                {(() => {
                  const services = [];
                  if (isShoulderMount) services.push('Shoulder Mount');
                  if (isEuroMount) {
                    let euroMountType = 'Euro Mount';
                    if (data.euroMount === 'Beetles finished mount') {
                      euroMountType = 'Euro Mount (Beetle Finished)';
                    } else if (data.euroMount === 'Boiled finished mount') {
                      euroMountType = 'Euro Mount (Boiled Finished)';
                    }
                    services.push(euroMountType);
                  }
                  if (isHideTanned) services.push('Hide');
                  return services.join(' & ') + ' Details';
                })()}
              </h4>
              <div className='grid grid-cols-1 gap-x-8 gap-y-4'>
                <div className='grid grid-cols-2 gap-x-5 gap-y-4'>{renderMountDetails()}</div>
              </div>
            </div>
          </div>
          {renderDepositAndBalance()}
          {renderReceipt()}
        </div>
      </div>
    </div>
  );
};

export default PrintShoulderMountDetails;

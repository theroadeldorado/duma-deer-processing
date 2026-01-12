import React from 'react';
import { DeerT } from 'lib/types';
import { calculateTotalPrice } from 'lib/priceCalculations';
import SummaryItemsGeneral from './SummaryItemsGeneral';
import SummaryItem from './SummaryItem';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { groupFormValuesBySections, SectionedValues } from '@/lib/formValueUtils';

interface PrintDeerDetailsProps {
  data: DeerT;
}

const PrintDeerDetails: React.FC<PrintDeerDetailsProps> = ({ data }) => {
  const { sectionedValues, hasEvenly } = groupFormValuesBySections(data, {
    applyBonelessGroundVenisonPricing: true,
    reorderContactInfo: true,
  });

  const renderContactInformation = () => {
    const contactInfo = sectionedValues['Contact Information'] || [];
    return <SummaryItemsGeneral values={contactInfo} print />;
  };

  const renderOtherInformation = (name: keyof SectionedValues) => {
    const contactInfo = sectionedValues[name] || [];

    return contactInfo.map(({ key, label, value, price, pricePer5lb, notes }) => (
      <SummaryItem key={key} label={label} value={value} price={price} pricePer5lb={pricePer5lb} notes={notes} print />
    ));
  };

  return (
    <div className='print-container flex flex-col'>
      <div className='break-after-page bg-white'>
        <div className='aspect-[5/8] w-[720px] break-inside-avoid-page bg-white'>
          <div
            className={clsx(
              (data.cape && data.cape !== 'false') || (data.euroMount && data.euroMount !== 'false') || (data.hide && data.hide !== 'false')
                ? 'border-red-500'
                : 'border-white',
              'border-[6px] p-2'
            )}
          >
            <div className='grid grid-cols-3 gap-8'>
              <h4 className='mb-2 font-bold'>{data.createdAt && dayjs(data.createdAt).format('M/D/YY  h:mm A')}</h4>
              <h4 className='mb-2'>
                Shot:{' '}
                {data.dateHarvested ? (dayjs(data.dateHarvested).isValid() ? dayjs(data.dateHarvested).format('M/D/YY') : data.dateHarvested) : '—'}
              </h4>
              <h4 className='mb-2'>
                Found: {data.dateFound ? (dayjs(data.dateFound).isValid() ? dayjs(data.dateFound).format('M/D/YY') : data.dateFound) : '—'}
              </h4>
            </div>
            <div className='border-b border-dashed border-gray-900 pb-3'>{renderContactInformation()}</div>
            <div className='gap-3 '>
              <h4 className='my-4 text-xl font-bold'>Cutting Instructions</h4>
              <div className='grid grid-cols-1 gap-x-8 gap-y-3'>{renderOtherInformation('Cutting Instructions')}</div>
            </div>
            {sectionedValues['Cutting Instructions Notes'] && (
              <div className='mb-4 gap-3 border-b border-dashed border-gray-900 pb-6 last:border-0'>
                <h4 className='mb-4 mt-2 text-xl font-bold'>Notes:</h4>
                <div className='grid grid-cols-1 gap-x-8 gap-y-3'>{renderOtherInformation('Cutting Instructions Notes')}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='break-after-page bg-white'>
        <div className='relative z-[1] aspect-[5/8] w-[720px] break-inside-avoid-page bg-white'>
          <div
            className={clsx(
              (data.cape && data.cape !== 'false') || (data.euroMount && data.euroMount !== 'false') || (data.hide && data.hide !== 'false')
                ? 'border-red-500'
                : 'border-white',
              'flex flex-col justify-between border-[6px] p-2'
            )}
          >
            <div>
              <h4 className='mb-2 font-bold'></h4>
              <div className='mb-6 gap-3'>
                <h4 className='my-4 text-xl font-bold'>Ground Venison</h4>
                <div className='grid gap-x-8 gap-y-3'>{renderOtherInformation('Ground Venison')}</div>
              </div>
              <div className='mb-6 gap-3 pb-6 last:border-0'>
                <h4 className='my-4 text-xl font-bold'>Specialty Meats</h4>
                <div className='grid grid-cols-1 gap-x-8 gap-y-3'>{renderOtherInformation('Specialty Meats')}</div>
              </div>

              {sectionedValues['Specialty Meats Notes'] && (
                <div className='mb-4 gap-3 border-b border-dashed border-gray-900 pb-6 last:border-0'>
                  <h4 className='mb-4 mt-2 text-xl font-bold'>Notes:</h4>
                  <div className='grid grid-cols-1 gap-x-8 gap-y-3'>{renderOtherInformation('Specialty Meats Notes')}</div>
                </div>
              )}
              <div className='flex flex-col items-end text-right'>
                <h4 className='mt-4 text-lg font-bold'>{hasEvenly ? 'Standard Processing Price' : 'Total Price'}</h4>

                {hasEvenly && (
                  <p className='max-w-[400px] text-sm italic'>
                    Selecting evenly distributed on a specialty meat could cause the price to increase by $300-$500+
                  </p>
                )}
                <p className='mb-6 mt-1 text-display-sm font-bold'>
                  <span className=''>$</span>
                  {calculateTotalPrice(data).toFixed(2)}
                </p>
                {hasEvenly && (
                  <>
                    <h4 className='text-lg font-bold '>Specialty Meat Price</h4>
                    <p className='mb-10 mt-1 text-display-sm font-bold'>
                      <span className=''> TBD</span>
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className='flex items-start gap-10'>
              <div className='flex-1'>
                <div className='my-4 flex items-end gap-1'>
                  <h4 className='shrink-0 grow text-xl font-bold'>$60 Deposit:</h4>
                  <span className='block w-full grow border-b border-dashed border-gray-900'></span>
                </div>
                <div className='flex items-start gap-6 text-[14px]'>
                  <span>Cash</span>
                  <span>Check</span>
                  <span>CC</span>
                </div>
              </div>
              <div className='flex-1'>
                <div className='my-4 flex items-end gap-1'>
                  <h4 className='shrink-0 grow text-xl font-bold'>Balance Due:</h4>
                  <span className='block w-full grow border-b border-dashed border-gray-900'></span>
                </div>
                <div className='flex items-start gap-6  text-[14px]'>
                  <span>Cash</span>
                  <span>Check</span>
                  <span>
                    <strong>CC $2</strong> Initials:
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintDeerDetails;

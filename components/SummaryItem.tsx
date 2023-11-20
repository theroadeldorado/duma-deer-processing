interface SummaryItemProps {
  label: string;
  value: string | number;
  price?: number;
  pricePer5lb?: boolean;
  section?: string;
  notes?: boolean;
}

const checkForPrice = (price: any) => {
  return price ? price : 0;
};

const SummaryItem: React.FC<SummaryItemProps> = ({ label, value, price, pricePer5lb, section, notes }) =>
  value && (
    <li className=''>
      {notes ? (
        <p className='-my-1 text-xs'>
          <div className='text-xs font-bold uppercase'>{label}:</div>
          <div>{value}</div>
        </p>
      ) : (
        <>
          <p className='text-xs font-bold uppercase'>{label}: </p>
          {pricePer5lb ? (
            <p className='flex items-end justify-between gap-1 border-b border-dashed border-gray-900 py-1'>
              {value === 'Evenly' ? (
                <span className='text-[24px] leading-[26px]'>Evenly Distribute</span>
              ) : (
                <span className='text-[24px] leading-[26px]'>{value}lbs</span>
              )}
              {price && <span className='text-sm'>(${price / 5}/lb)</span>}
              <span className='shrink-0 grow justify-items-end text-right'>${price ? price.toFixed(2) : (0).toFixed(2)}</span>
            </p>
          ) : (
            <p className='flex items-end justify-between gap-1 border-b border-dashed border-gray-900 py-1'>
              <span className='text-[24px] leading-[26px]'>{value}</span>
              <span className='shrink-0 grow justify-items-end text-right'>${price ? price.toFixed(2) : (0).toFixed(2)}</span>
            </p>
          )}
        </>
      )}
    </li>
  );

export default SummaryItem;

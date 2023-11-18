interface SummaryItemProps {
  label: string;
  value: string | number;
  price?: number;
  pricePer5lb?: boolean;
  section?: string;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ label, value, price, pricePer5lb, section }) =>
  // only show if has a value
  value && (
    <li className=''>
      <p className='text-xs font-bold uppercase'>{label}: </p>

      {pricePer5lb ? (
        <p className='flex items-end justify-between gap-1 border-b border-dashed border-gray-900 py-1'>
          <span className='text-[24px] leading-[26px]'>{value}lbs</span>
          <span className='text-sm'>(${price / 5}/lb)</span>
          <span className='shrink-0 grow justify-items-end text-right'>${price.toFixed(2)}</span>
        </p>
      ) : (
        <p className='flex items-end justify-between gap-1 border-b border-dashed border-gray-900 py-1'>
          <span className='text-[24px] leading-[26px]'>{value}</span>
          <span className='shrink-0 grow justify-items-end text-right'>${price.toFixed(2)}</span>
        </p>
      )}
    </li>
  );

export default SummaryItem;

interface SummaryItemProps {
  label: string;
  value: string | number;
  price?: number;
  pricePer5lb?: boolean;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ label, value, price, pricePer5lb }) =>
  // only show if has a value
  value && (
    <li>
      <span className='font-bold'>{label}: </span>
      {pricePer5lb ? (
        <span>
          {value}lbs {price ? `$${price.toFixed(2)}` : ''}
        </span>
      ) : (
        <span>{price ? `${value} $${price.toFixed(2)}` : value}</span>
      )}
    </li>
  );

export default SummaryItem;

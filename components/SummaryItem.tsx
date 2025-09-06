interface SummaryItemProps {
  label: string;
  value: string | number;
  price?: number;
  pricePer5lb?: boolean;
  section?: string;
  notes?: boolean;
  print?: boolean;
}

// const removeWordsFromLabel will remove the word "Preference" from the label
// leave the rest of the string but remove the word "Preference"

const removeWordsFromLabel = (label: string) => {
  // if label is "Skinned or Boneless" then return "Base"
  if (label === 'Skinned or Boneless') return 'Processing';
  const wordsToRemove = ['Preference'];
  const words = label.split(' ');
  const filteredWords = words.filter((word) => !wordsToRemove.includes(word));
  return filteredWords.join(' ');
};

const calculatePricePerPound = (price: number, value: string | number) => {
  if (value === 'Evenly') return (price / 5).toFixed(2);
  const pricePerPound = price / Number(value);
  return pricePerPound.toFixed(2);
};

const SummaryItem: React.FC<SummaryItemProps> = ({ label, value, price, pricePer5lb, section, notes, print }) =>
  value &&
  value !== 'false' && (
    <div className=''>
      {notes ? (
        <p className='-my-1 text-sm'>
          <span className='block text-sm font-bold uppercase'>{label}:</span>
          <span>{value}</span>
        </p>
      ) : (
        <>
          {!print && <p className='text-sm font-bold uppercase'>{label}: </p>}
          {print && <p className='text-[28px] font-bold leading-[1.2]'>{removeWordsFromLabel(label)}: </p>}
          {pricePer5lb ? (
            <p className='flex items-end justify-between gap-1 border-b border-dashed border-gray-900 py-1'>
              {value === 'Evenly' ? (
                <span className={print ? 'text-[28px] leading-[1.2]' : 'text-[26px] leading-[1.2]'}>Evenly</span>
              ) : (
                <span className={print ? 'text-[28px] leading-[1.2]' : 'text-[26px] leading-[1.2]'}>{value}lbs</span>
              )}

              {price && <span className='text-sm'>(${calculatePricePerPound(price, value)}/lb)</span>}
              {value === 'Evenly' ? (
                <span className='shrink-0 grow justify-items-end text-right'>TBD</span>
              ) : (
                <span className='shrink-0 grow justify-items-end text-right'>${price ? price.toFixed(2) : (0).toFixed(2)}</span>
              )}
            </p>
          ) : (
            <p className='flex items-end justify-between gap-1 border-b border-dashed border-gray-900 py-1'>
              <span className={print ? 'text-[28px] leading-[1.2]' : 'text-[26px] leading-[1.2]'}>{value}</span>
              <span className='shrink-0 grow justify-items-end text-right'>${price ? price.toFixed(2) : (0).toFixed(2)}</span>
            </p>
          )}
        </>
      )}
    </div>
  );

export default SummaryItem;

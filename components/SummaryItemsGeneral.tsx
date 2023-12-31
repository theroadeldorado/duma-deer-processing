import clsx from 'clsx';

interface SummaryItemsGeneralProps {
  values: {
    label: string;
    value: string | number;
  }[];
  section?: string;
  print?: boolean;
}

const renderWithLineBreaks = (text: string) => {
  return text.split('\n').map((line, index) => (
    <span key={index}>
      {line}
      {index < text.split('\n').length - 1 && <br />}
    </span>
  ));
};

const SummaryItemsGeneral: React.FC<SummaryItemsGeneralProps> = ({ values, section, print }) => {
  return (
    <div className='grid grid-cols-3 gap-x-8 gap-y-3'>
      {values.map(({ label, value }) => (
        <div
          key={String(value)}
          className={clsx(
            label === 'Name' && 'col-start-1 row-start-1',
            label === 'Address' && 'col-start-1 row-start-2',
            label === 'Phone' && 'col-start-2 row-start-1',
            label === 'Communication' && 'col-start-2 row-start-2',
            label === 'Tag Number' && 'col-start-3 row-start-1',
            label === 'State Harvested In' && 'col-start-3 row-start-2'
          )}
        >
          {!print && <p className='text-xs font-bold uppercase'>{label}: </p>}
          <p className={clsx(print ? 'text-xl font-bold leading-[1.2]' : 'text-md')}>
            {print && label === 'Tag Number' && <span className='font-bold'>Tag#: </span>}

            {renderWithLineBreaks(String(value))}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SummaryItemsGeneral;

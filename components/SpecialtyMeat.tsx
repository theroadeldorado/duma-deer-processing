import Image from 'next/image';
import Select from './Select';
import { useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import Textarea from './Textarea';

type Props = {
  name: string;
  image?: string;
  options: { name: string; label: string; price: number; priceFlat?: boolean }[];
  admin?: boolean;
};

export default function SpecialtyMeat({ name, image, options, admin = false }: Props) {
  const { register } = useFormContext();
  const selectOptions = [
    { value: '5lbs', label: '5lbs' },
    { value: '10lbs', label: '10lbs' },
    { value: '15lbs', label: '15lbs' },
    { value: '20lbs', label: '20lbs' },
    { value: '25lbs', label: '25lbs' },
    { value: '30lbs', label: '30lbs' },
    { value: '35lbs', label: '35lbs' },
    { value: '40lbs', label: '40lbs' },
    { value: '45lbs', label: '45lbs' },
    { value: '50lbs', label: '50lbs' },
    { value: 'Evenly', label: 'Evenly Distribute' },
  ];

  const printPrice = (price: number, priceFlat?: boolean) => {
    if (priceFlat) {
      return `$${price} Flat Rate`;
    } else {
      return `$${price} per 5lb lot`;
    }
  };

  return (
    <>
      {admin ? (
        options &&
        options.map((option) => (
          <div key={option.name} className='flex flex-col gap-1'>
            <Select
              key={option.name}
              name={option.name.replace(/\s+/g, '-').toLowerCase()}
              label={option.label}
              register={register}
              options={selectOptions}
              isClearable
              placeholder={`Select Amount - ${printPrice(option.price, option.priceFlat)}`}
            />
          </div>
        ))
      ) : (
        <div className='grid grid-cols-2 gap-6'>
          <h3 className='col-span-2 text-center text-display-xs font-bold'>{name}</h3>
          <div className='relative overflow-hidden rounded-md'>
            {image && <Image src={image} className={clsx('absolute inset-0 h-full w-full object-cover')} width={500} height={300} alt={name} />}
          </div>
          <div className='flex flex-col gap-3'>
            {options &&
              options.map((option) => (
                <div key={option.name} className='flex flex-col gap-1'>
                  <Select
                    key={option.name}
                    name={option.name.replace(/\s+/g, '-').toLowerCase()}
                    label={option.label}
                    register={register}
                    options={selectOptions}
                    isClearable
                    placeholder={`Select Amount - ${printPrice(option.price, option.priceFlat)}`}
                  />
                </div>
              ))}
            <Textarea rows={2} name={`${name}Notes`} label='Special Instructions' register={register} />
          </div>
        </div>
      )}
    </>
  );
}

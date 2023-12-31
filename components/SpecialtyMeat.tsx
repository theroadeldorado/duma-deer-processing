import Image from 'next/image';
import Select from './Select';
import { useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import Textarea from './Textarea';

type Props = {
  name: string;
  image?: string;
  options: { name: string; label: string; price: number }[];
  admin?: boolean;
};

export default function SpecialtyMeat({ name, image, options, admin = false }: Props) {
  const { register } = useFormContext();

  const getSelectOptions = (price: number) => {
    let baseOptions = [
      { value: 'false', label: 'None' },
      { value: '5', label: '5lbs' },
      { value: '10', label: '10lbs' },
      { value: '15', label: '15lbs' },
      { value: '20', label: '20lbs' },
      { value: '25', label: '25lbs' },
      { value: '30', label: '30lbs' },
      { value: '35', label: '35lbs' },
      { value: '40', label: '40lbs' },
      { value: '45', label: '45lbs' },
      { value: '50', label: '50lbs' },
      { value: 'Evenly', label: 'Evenly Distribute' },
    ];

    if (admin) {
      baseOptions.unshift({ value: '0', label: `Select Amount - $${price} per 5lb lot` });
    }

    return baseOptions;
  };

  const printPrice = (price: number) => {
    return `$${price} per 5lb lot`;
  };

  const removeSpacesAndCamelCase = (str: string) => {
    // lowercase first letter
    str = str.charAt(0).toLowerCase() + str.slice(1);
    return str.replace(/\s+/g, '');
  };

  return (
    <>
      {admin ? (
        options &&
        options.map((option) => (
          <div key={option.name} className='flex flex-col gap-1'>
            <Select
              key={option.name}
              name={option.name.replace(/\s+/g, '')}
              label={option.label}
              register={register}
              options={getSelectOptions(option.price)}
              placeholder={`Select Amount - ${printPrice(option.price)}`}
            />
          </div>
        ))
      ) : (
        <div className='grid grid-cols-2 gap-6'>
          <h3 className='col-span-2 text-center text-display-xs font-bold'>{name}</h3>
          <div className='relative min-h-[220px] overflow-hidden rounded-md'>
            {image && <Image src={image} className={clsx('absolute inset-0 h-full w-full object-cover')} width={500} height={300} alt={name} />}
          </div>
          <div className='flex flex-col gap-3'>
            {options &&
              options.map((option) => (
                <div key={option.name} className='flex flex-col gap-1'>
                  <Select
                    key={option.name}
                    name={option.name.replace(/\s+/g, '')}
                    label={option.label}
                    register={register}
                    options={getSelectOptions(option.price)}
                    placeholder={`Select Amount - ${printPrice(option.price)}`}
                  />
                </div>
              ))}
            {/* <Textarea rows={2} name={`${removeSpacesAndCamelCase(name)}Notes`} label='Special Instructions' register={register} /> */}
          </div>
        </div>
      )}
    </>
  );
}

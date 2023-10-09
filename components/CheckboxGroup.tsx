import { useFormContext } from 'react-hook-form';
import { FieldWrapper } from 'components/FieldWrapper';
import clsx from 'clsx';

type CheckboxOption = {
  value: string;
  label: string;
};

type CheckboxGroupProps = {
  className?: string;
  name: string;
  options: CheckboxOption[];
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  wrapperLabel?: string;
  help?: string;
  defaultCheckedValues?: string[]; // The values of the options that should be checked by default
  [x: string]: any;
};

const CheckboxGroup = ({ className, name, options, required, onChange, wrapperLabel, help, defaultCheckedValues, ...props }: CheckboxGroupProps) => {
  const { register } = useFormContext();

  return (
    <FieldWrapper {...{ name, label: wrapperLabel, required, help }}>
      {options.map((option) => (
        <div key={option.value} className='flex flex-wrap items-center justify-start gap-2'>
          <input
            type='checkbox'
            value={option.value}
            defaultChecked={defaultCheckedValues?.includes(option.value)}
            {...register(name, { onChange, required: required ? 'This field is required' : false })}
            className={clsx('checkbox', className)}
            {...props}
          />
          <label htmlFor={`${name}_${option.value}`}>{option.label}</label>
        </div>
      ))}
    </FieldWrapper>
  );
};

export default CheckboxGroup;

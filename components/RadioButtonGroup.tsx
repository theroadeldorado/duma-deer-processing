import { useFormContext } from 'react-hook-form';
import { FieldWrapper } from 'components/FieldWrapper';
import clsx from 'clsx';

type RadioOption = {
  value: string;
  label: string;
};

type RadioButtonProps = {
  className?: string;
  name: string;
  options: RadioOption[];
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  wrapperLabel?: string;
  help?: string;
  defaultCheckedValue?: string; // The value of the option that should be checked by default
  [x: string]: any;
};

const RadioButtonGroup = ({ className, name, options, required, onChange, wrapperLabel, help, defaultCheckedValue, ...props }: RadioButtonProps) => {
  const { register } = useFormContext();

  return (
    <FieldWrapper {...{ name, label: wrapperLabel, required, help }} isRadio>
      {options.map((option) => (
        <div key={option.value} className='flex flex-wrap items-center justify-start gap-2'>
          <input
            type='radio'
            value={option.value}
            defaultChecked={defaultCheckedValue === option.value}
            {...register(name, { onChange, required: required ? 'This field is required' : false })}
            className={clsx('radio-button', className)}
            {...props}
          />
          <label htmlFor={`${name}_${option.value}`}>{option.label}</label>
        </div>
      ))}
    </FieldWrapper>
  );
};

export default RadioButtonGroup;

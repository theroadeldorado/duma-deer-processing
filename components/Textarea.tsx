import { useFormContext } from 'react-hook-form';
import { FieldWrapper } from '@/components/FieldWrapper';
import clsx from 'clsx';

type InputProps = {
  className?: string;
  name: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  large?: boolean;
  [x: string]: any;
};

const Input = ({ className, name, required, onChange, label, large, ...props }: InputProps) => {
  const { register } = useFormContext();
  return (
    <FieldWrapper name={name} label={label} required={required}>
      <textarea
        {...register(name, { onChange, required: required ? 'This field is required' : false })}
        className={clsx('input w-full', className)}
        {...props}
      />
    </FieldWrapper>
  );
};

export default Input;

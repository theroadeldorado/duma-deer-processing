import { useFormContext } from 'react-hook-form';
import { newPasswordValidation } from '@/config/form';
import { FieldWrapper } from 'components/FieldWrapper';
import Icon from 'components/Icon';
import { useState } from 'react';
import clsx from 'clsx';

type InputProps = {
  type: string;
  className?: string;
  name: string;
  required?: boolean;
  validateNewPassword?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  help?: string;
  [x: string]: any;
};

const Input = ({ type, className, name, required, validateNewPassword, onChange, label, help, ...props }: InputProps) => {
  const { register } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  const handleTelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters
    let formattedValue = value;

    if (value.length > 3 && value.length <= 6) {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 6) {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`;
    }

    // Only update the input value if the formatted value is different
    if (e.target.value !== formattedValue) {
      e.target.value = formattedValue;
    }

    onChange?.(e);
  };

  if (type === 'password') {
    type = showPassword ? 'text' : 'password';
  } else if (type === 'tel') {
    onChange = handleTelChange;
  } else {
    type = type || 'text';
  }

  return (
    <FieldWrapper {...{ name, label, required, help }}>
      <input
        {...register(name, { onChange, required: required ? 'This field is required' : false, ...(validateNewPassword && newPasswordValidation) })}
        type={type}
        className={clsx('input w-full', (type === 'password' || (type === 'text' && showPassword)) && 'pr-11', className)}
        step={type === 'number' ? 'any' : undefined}
        {...props}
      />

      {(type === 'password' || (type === 'text' && showPassword)) && (
        <button
          onClick={() => setShowPassword(!showPassword)}
          type='button'
          className='absolute top-0 bottom-0 right-4'
          title='Toggle show password'
          tabIndex={-1}
        >
          {showPassword ? <Icon name='eye' /> : <Icon name='eyeSlash' />}
        </button>
      )}
    </FieldWrapper>
  );
};

export default Input;

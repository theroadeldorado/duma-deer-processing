import { newPasswordValidation } from '@/config/form';
import clsx from 'clsx';
import { FieldWrapper } from 'components/FieldWrapper';
import Icon from 'components/Icon';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

// Define a specific type for input types
type InputType =
  | 'text'
  | 'password'
  | 'tel'
  | 'number'
  | 'email'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'month'
  | 'week'
  | 'url'
  | 'search'
  | 'color';

interface InputProps {
  type: InputType;
  className?: string;
  name: string;
  required?: boolean;
  validateNewPassword?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  hint?: string;
  [x: string]: any; // Consider defining specific props instead of using an index signature for better type safety
  register?: any; // Define the correct type for 'register' if possible
}

const Input: React.FC<InputProps> = ({ type, className, name, required, validateNewPassword, onChange, label, hint, ...props }) => {
  const { register } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const [formattedValue, setFormattedValue] = useState('');

  const inputValue = type === 'tel' ? formattedValue : props.value;

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value) {
      // Check if value is not null
      const phone = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      if (phone) {
        const formatted = !phone[2] ? phone[1] : `(${phone[1]}) ${phone[2]}${phone[3] ? `-${phone[3]}` : ''}`;
        e.target.value = formatted;
        setFormattedValue(formatted);
      }
    }
  };

  const resolvedType = type === 'password' && showPassword ? 'text' : type;

  return (
    <FieldWrapper {...{ name, label, required, hint }}>
      <input
        {...register(name, { onChange, required: required ? 'This field is required' : false, ...(validateNewPassword && newPasswordValidation) })}
        type={resolvedType}
        className={clsx('input w-full', resolvedType === 'password' && 'pr-11', className)}
        step={resolvedType === 'number' ? 'any' : undefined}
        onChange={resolvedType === 'tel' ? handlePhoneInputChange : onChange}
        value={inputValue}
        {...props}
      />
      {resolvedType === 'password' && (
        <button
          onClick={() => setShowPassword(!showPassword)}
          type='button'
          className='absolute bottom-0 right-4 top-0'
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

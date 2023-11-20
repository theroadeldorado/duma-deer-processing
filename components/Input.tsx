import { useFormContext } from 'react-hook-form';
import { newPasswordValidation } from '@/config/form';
import { FieldWrapper } from 'components/FieldWrapper';
import Icon from 'components/Icon';
import { useRef, useState } from 'react';
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
  register?: any;
};

const Input = ({ type, className, name, required, validateNewPassword, onChange, label, help, ...props }: InputProps) => {
  const { register } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const [formattedValue, setFormattedValue] = useState('');

  const valueRef = useRef('');

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

  if (type === 'password') {
    type = showPassword ? 'text' : 'password';
  } else if (type === 'number') {
    type = 'number';
  } else if (type === 'tel') {
    type = 'tel';
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
        onChange={type === 'tel' ? handlePhoneInputChange : onChange}
        value={inputValue}
        {...props}
      />

      {(type === 'password' || (type === 'text' && showPassword)) && (
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

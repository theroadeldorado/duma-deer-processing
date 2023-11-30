'use client';
import { newPasswordValidation } from '@/config/form';
import clsx from 'clsx';
import { FieldWrapper } from 'components/FieldWrapper';
import Icon from 'components/Icon';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

type InputProps = {
  type: string;
  className?: string;
  name: string;
  required?: boolean;
  validateNewPassword?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  hint?: string;
  [x: string]: any;
};

const Input = ({ type, className, name, required, validateNewPassword, onChange, label, hint, ...props }: InputProps) => {
  const { register } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  if (type === 'password') {
    type = showPassword ? 'text' : 'password';
  } else {
    type = type || 'text';
  }

  return (
    <FieldWrapper {...{ name, label, required, hint }}>
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

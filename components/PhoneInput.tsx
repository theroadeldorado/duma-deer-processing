import clsx from 'clsx';
import { FieldWrapper } from 'components/FieldWrapper';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

type InputProps = {
  className?: string;
  name: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  hint?: string;
  [x: string]: any;
};

const PhoneInput = ({ className, name, required, onChange, label, hint, ...props }: InputProps) => {
  const [formattedValue, setFormattedValue] = useState('');
  const { register } = useFormContext();

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Check if the event is from the tel input
    if (e.target && e.target.type === 'tel') {
      const value = e.target.value;
      if (value) {
        const phone = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        if (phone) {
          const formatted = !phone[2] ? phone[1] : `(${phone[1]}) ${phone[2]}${phone[3] ? `-${phone[3]}` : ''}`;
          setFormattedValue(formatted);
        }
      } else {
        setFormattedValue('');
      }
    }
  };

  return (
    <FieldWrapper {...{ name, label, required, hint }}>
      <input
        type='tel'
        {...register(name, { required: required ? 'This field is required' : false })}
        value={formattedValue}
        className={clsx('input w-full', className)}
        onChange={handlePhoneInputChange}
        {...props}
      />
    </FieldWrapper>
  );
};

export default PhoneInput;

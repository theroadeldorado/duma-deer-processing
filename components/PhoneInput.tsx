import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FieldWrapper } from 'components/FieldWrapper';
import clsx from 'clsx';

// Define the props type for the PhoneInput component
type InputProps = {
  className?: string;
  name: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  hint?: string;
  [x: string]: any; // for additional props
};

// Function to format phone number
function formatPhoneNumber(value: string) {
  const phoneNumber = value.replace(/\D/g, ''); // Remove non-numeric characters
  const phoneNumberMatch = phoneNumber.match(/(\d{1,3})(\d{0,3})(\d{0,4})/);

  // Format the phone number parts
  let formatted = '';
  if (phoneNumberMatch) {
    const [, areaCode, firstThree, lastFour] = phoneNumberMatch;
    if (areaCode) {
      formatted = `(${areaCode}`;
    }
    if (firstThree) {
      formatted += `) ${firstThree}`;
    }
    if (lastFour) {
      formatted += `-${lastFour}`;
    }
  }

  return formatted;
}

// PhoneInput component
const PhoneInput = ({ className, name, required, onChange, label, hint, ...props }: InputProps) => {
  const [formattedValue, setFormattedValue] = useState('');
  const { register } = useFormContext();

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value);
    setFormattedValue(formatted);
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

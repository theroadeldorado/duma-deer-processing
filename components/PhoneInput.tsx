import React, { useState, useEffect } from 'react';
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
  const { register, watch, setValue } = useFormContext();
  const currentValue = watch(name);
  const [formattedValue, setFormattedValue] = useState('');

  // Initialize and sync formatted value with form value
  useEffect(() => {
    if (currentValue) {
      const formatted = formatPhoneNumber(currentValue);
      setFormattedValue(formatted);
    }
  }, [currentValue]);

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value);
    setFormattedValue(formatted);

    // Update the form with the raw phone number (digits only)
    const rawPhoneNumber = value.replace(/\D/g, '');
    setValue(name, rawPhoneNumber);

    // Call the onChange prop if provided
    if (onChange) {
      onChange(e);
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

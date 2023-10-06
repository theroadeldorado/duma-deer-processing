import { RegisterOptions } from 'react-hook-form';

export const newPasswordValidation: RegisterOptions = {
  minLength: {
    value: 8,
    message: 'Must contain at least 8 characters',
  },
  maxLength: {
    value: 64, // OWASP reccommendation
    message: 'Too many characters',
  },
  pattern: {
    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s]).*$/, // at least one letter, one number and one special character
    message: 'Must contain at least one letter, one number, and one special character',
  },
};

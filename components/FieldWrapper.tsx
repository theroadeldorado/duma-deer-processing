import { useFormContext } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import clsx from 'clsx';

type Props = {
  name: string;
  label?: string;
  children: React.ReactNode;
  required?: boolean;
  isRadio?: boolean;
};

export const FieldWrapper = ({ name, label, children, required, isRadio }: Props) => {
  const { formState } = useFormContext();
  const { errors } = formState;
  if (!label)
    return (
      <div className='relative'>
        <div className='relative flex-grow'>{children}</div>
        <ErrorMessage errors={errors} name={name} render={({ message }) => <span className='text-sm text-red-600'>{message}</span>} />
      </div>
    );
  return (
    <label className='relative flex flex-col gap-1 text-gray-700'>
      <span>
        {label}
        {required && <strong className='font-normal text-red-600'>*</strong>}
      </span>
      <div className={clsx(isRadio && 'mt-1 flex flex-wrap items-center justify-start gap-x-6 gap-y-2', 'relative flex-grow')}>{children}</div>
      <ErrorMessage errors={errors} name={name} render={({ message }) => <span className='text-sm text-red-600'>{message}</span>} />
    </label>
  );
};

import * as React from 'react';
import Title from '@/components/Title';
import Logo from '@/components/Logo';

type PropTypes = {
  heading: string;
  children: React.ReactNode;
};

export default function UtilityPage({ heading, children }: PropTypes) {
  return (
    <div className='utility-page flex flex-col justify-center py-12 sm:px-6 md:min-h-[800px] lg:px-8'>
      <Title>{heading}</Title>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <Logo className='mx-auto mb-8 w-16' />
        <h2 className='mt-6 text-center text-xl font-extrabold text-gray-900'>{heading}</h2>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>{children}</div>
      </div>
    </div>
  );
}

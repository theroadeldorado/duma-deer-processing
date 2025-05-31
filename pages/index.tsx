import Link from 'next/link';
import getSecureServerSideProps from '@/lib/getSecureServerSideProps';
import CheckInFormRefactored from '@/components/CheckInFormRefactored';
import Title from '@/components/Title';
import Logo from '@/components/Logo';

export default function UserDashboard() {
  return (
    <div className='container flex max-w-[900px] flex-col justify-center py-12 sm:px-6 md:min-h-[800px] lg:px-8'>
      <div className='mb-10 sm:mx-auto sm:w-full sm:max-w-md'>
        <Logo className='mx-auto mb-8 w-[300px]' />
        <h2 className='mt-6 text-center text-xl font-extrabold '>Deer drop off form</h2>
      </div>

      <div className='bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>
        <CheckInFormRefactored />
      </div>
    </div>
  );
}

export const getServerSideProps = getSecureServerSideProps(() => ({ props: {} }));

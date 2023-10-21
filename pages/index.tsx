import Link from 'next/link';
import getSecureServerSideProps from '@/lib/getSecureServerSideProps';
import CheckInForm from '@/components/CheckInForm';
import Title from '@/components/Title';

export default function UserDashboard() {
  return (
    <div className='container flex max-w-[900px] flex-col justify-center py-12 sm:px-6 md:min-h-[800px] lg:px-8'>
      <h2 className='my-6 font-extrabold text-center text-gray-700 text-display-lg'>Deer drop off form</h2>

      <div className='px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10'>
        <CheckInForm />
      </div>
    </div>
  );
}

export const getServerSideProps = getSecureServerSideProps(() => ({ props: {} }));

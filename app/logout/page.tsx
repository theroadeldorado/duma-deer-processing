import { LoaderIcon } from 'react-hot-toast';
import { getMetadata } from '@/lib/helpers';
import Logout from './Logout';

export const metadata = getMetadata({
  title: 'Logging Out',
});

export default function Page() {
  return (
    <>
      <div className='relative flex min-h-screen flex-col bg-white'>
        <main className='relative flex flex-grow items-center justify-center overflow-hidden'>
          <div className='container h-full px-8 pb-14'>
            <LoaderIcon className='mx-auto mb-4' />
            <h1 className=' text-center text-2xl font-black uppercase text-gray-500'>Logging out</h1>
            <p className='mx-auto max-w-xl text-center text-lg text-gray-500 md:text-xl'>Please wait while we log you out of your account.</p>
          </div>
        </main>
      </div>
      <Logout />
    </>
  );
}

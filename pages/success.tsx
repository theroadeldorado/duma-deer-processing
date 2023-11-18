import Button from 'components/Button';
import UtilityPage from '@/components/layouts/Utility';
import Link from 'next/link';

setTimeout(() => {
  window.location.href = '/';
}, 12000);

export default function success() {
  return (
    <UtilityPage heading='Deer drop off form'>
      <h2 className='my-6 text-center text-display-lg font-extrabold text-gray-700'>Thank You</h2>
      <p className='text-center'>
        Your submission has successful. This will speed up our check-in process! You still need to review your info and cutting instructions with
        someone at the front desk.
      </p>
      <p className='mt-6 text-center'>
        <Link href='/'>
          <Button type='button'>New Deer Check-In</Button>
        </Link>
      </p>
    </UtilityPage>
  );
}

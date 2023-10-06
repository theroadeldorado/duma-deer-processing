import Button from '@/components/Button';
import Icon from '@/components/Icon';

type Props = {
  reset: () => void;
  error: Error;
};

export default function ErrorMessage({ error, reset }: Props) {
  return (
    <section className='relative mt-12 flex h-full items-center justify-center'>
      <div className='relative flex flex-col items-center justify-center gap-3 text-center'>
        <p className='text-sm font-semibold text-red-600'>Something went wrong!</p>
        <p className='max-w-xl text-center text-lg text-gray-600 md:text-xl'>Sorry, we encountered an error. Try again or reload the page.</p>
        <p className='text-xs text-gray-400'>Error: {error.message}</p>

        <div className='mt-2'>
          <Button onClick={() => reset()} className='gap-2' color='default'>
            <Icon name='retry' />
            Try Again
          </Button>
        </div>
      </div>
    </section>
  );
}

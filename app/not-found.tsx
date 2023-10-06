export default function NotFound() {
  return (
    <div className='mt-16 flex flex-col items-center justify-center gap-3 text-center'>
      <p className='text-3xl font-semibold text-gray-700'>Page Not Found</p>
      <p className='my-4 max-w-xl text-center text-lg text-gray-600 md:text-xl'>
        {' '}
        Sorry, the page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <p className='text-xs text-gray-400'>Error: 404</p>
    </div>
  );
}

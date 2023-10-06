import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Icon from '@/components/Icon';
import clsx from 'clsx';

type Props = {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
};

export default function ColModal({ title, open, onClose, children, width }: Props) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-50' initialFocus={cancelButtonRef} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel
                className={clsx(
                  'relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6',
                  !width && 'sm:max-w-lg'
                )}
                style={width ? { maxWidth: width } : {}}
              >
                <div className='absolute right-0 top-0 hidden pr-4 pt-4 sm:block'>
                  <button type='button' className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none' onClick={onClose}>
                    <span className='sr-only'>Close</span>
                    <Icon name='close' className='h-6 w-6' aria-hidden='true' />
                  </button>
                </div>
                <Dialog.Title as='h3' className='mb-4 text-xl font-medium leading-6 text-gray-900'>
                  {title}
                </Dialog.Title>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

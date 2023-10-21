import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import Icon from '@/components/Icon';
import Logo from '@/components/Logo';
import FocusLock from 'react-focus-lock';

type Props = {
  className?: string;
};

const Navigation = ({ className }: Props) => {
  const [open, setOpen] = useState(false);
  const { pathname } = useRouter();

  const links = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/templates', label: 'Email Templates' },
  ];

  useEffect(() => {
    const escFunction = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', escFunction, false);
    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, []);

  return (
    <>
      <button type='button' onClick={() => setOpen(!open)} title='Toggle menu' className='block lg:hidden'>
        <Icon name='menu' className='h-5 w-5' />
      </button>

      <button
        type='button'
        onClick={() => setOpen(false)}
        aria-label='Close menu'
        className={clsx(
          'fixed inset-0 z-50 h-screen w-screen bg-gray-900/75 transition-opacity duration-500',
          open ? 'block opacity-100 lg:pointer-events-none lg:opacity-0' : 'pointer-events-none opacity-0'
        )}
      />

      <FocusLock disabled={!open}>
        <div
          className={clsx(
            'transition-all duration-300',
            open
              ? 'pointer-events-auto fixed inset-0 z-50 max-h-screen max-w-xs translate-x-0 overflow-auto bg-white shadow-xl lg:relative lg:z-auto lg:max-w-none lg:bg-transparent lg:shadow-none'
              : 'pointer-events-none -translate-x-full lg:pointer-events-auto lg:translate-x-0'
          )}
        >
          <div className={clsx('container px-8 py-4', open ? 'flex lg:hidden' : 'hidden')}>
            <Logo className='w-8' />
          </div>

          <button
            type='button'
            onClick={() => setOpen(false)}
            title='Close menu'
            className={clsx(
              'absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-50',
              open ? 'visible lg:hidden' : 'hidden'
            )}
          >
            <Icon name='close' className='h-5 w-5' />
          </button>

          <nav className={clsx('gap-1', open ? 'flex flex-col items-start p-3 px-5 lg:flex-row' : 'hidden items-center lg:flex', className)}>
            {links.map(({ href, label }, index) => (
              <Link
                key={index}
                href={href}
                className={clsx('rounded-md px-3 py-2 text-md font-semibold  hover:bg-gray-100', pathname === href ? 'bg-gray-50' : '')}
              >
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </FocusLock>
    </>
  );
};

export default Navigation;

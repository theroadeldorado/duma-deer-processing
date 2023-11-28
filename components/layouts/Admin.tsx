import * as React from 'react';
import Title from '@/components/Title';
import Logo from '@/components/Logo';
import Navigation from '@/components/Navigation';
import AccountDropdown from '@/components/AccountDropdown';
import Link from 'next/link';

type PropTypes = {
  title: string;
  children: React.ReactNode;
};

export default function AdminPage({ title, children }: PropTypes) {
  return (
    <div className='flex min-h-screen flex-col'>
      <Title>{title}</Title>
      <header className='mb-8 border-b border-gray-200 bg-white text-lg print:hidden'>
        <div className='flex items-center justify-between gap-8 px-8 py-4'>
          <div className='flex items-center gap-4'>
            <Link href='/admin/deers'>
              <Logo className='w-28 -translate-y-1' />
            </Link>
            <Navigation />
          </div>

          <div className='flex items-center gap-4'>
            <AccountDropdown />
          </div>
        </div>
      </header>
      <main className='flex-grow'>
        <div className='mx-auto px-8 pb-14'>{children}</div>
      </main>
    </div>
  );
}

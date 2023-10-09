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
    <div className='flex flex-col min-h-screen'>
      <Title>{title}</Title>
      <header className='mb-8 text-lg text-gray-900 bg-white border-b border-gray-200 print:hidden'>
        <div className='container flex items-center justify-between gap-8 px-8 py-4'>
          <div className='flex items-center gap-4'>
            <Link href='/admin'>
              <Logo className='-translate-y-1 w-28' />
            </Link>
            <Navigation />
          </div>

          <div className='flex items-center gap-4'>
            <AccountDropdown />
          </div>
        </div>
      </header>
      <main className='flex-grow'>
        <div className='container px-8 mx-auto pb-14'>{children}</div>
      </main>
    </div>
  );
}

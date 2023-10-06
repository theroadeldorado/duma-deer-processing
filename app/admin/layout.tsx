import { redirect } from 'next/navigation';
import { RoleType } from 'lib/enums';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import Logo from '@/components/Logo';
import Navigation from './Navigation';
import AccountDropdown from './AccountDropdown';

type Props = {
  children: React.ReactNode;
};

export default async function AdminLayout({ children }: Props) {
  const session = await getSession();
  if (session?.role !== RoleType.ADMIN) redirect('/login?unauthorized=true');

  return (
    <div className='flex min-h-screen flex-col'>
      <header className='mb-8 border-b border-gray-200 bg-white text-lg text-gray-900 print:hidden'>
        <div className='container flex items-center justify-between gap-8 px-8 py-4'>
          <div className='flex items-center gap-4'>
            <Link href='/admin'>
              <Logo className='mr-4 w-6' />
            </Link>
            <Navigation />
          </div>

          <div className='flex items-center gap-4'>
            <AccountDropdown />
          </div>
        </div>
      </header>
      <main className='flex-grow'>
        <div className='container mx-auto px-8 pb-14'>{children}</div>
      </main>
    </div>
  );
}

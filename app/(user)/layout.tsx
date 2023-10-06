import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { auth } from 'lib/firebaseAdmin';
import { RoleType } from 'lib/enums';

type Props = {
  children: React.ReactNode;
};

export default async function UserLayout({ children }: Props) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) redirect('/login');

  let token = null;
  try {
    token = await auth.verifySessionCookie(sessionCookie.value);
  } catch (error) {
    redirect('/login');
  }

  return (
    <div>
      <h1 className='text-4xl font-bold'>User Dashboard</h1>
      {children}
    </div>
  );
}

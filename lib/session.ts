import 'server-only';
import { cache } from 'react';
import { auth } from '@/lib/firebaseAdmin';
import { cookies } from 'next/headers';
import { SessionDataT } from '@/lib/types';

export const getSession = cache(async (): Promise<SessionDataT | null> => {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session');
  if (!sessionCookie) return null;

  let token = {};
  try {
    token = await auth.verifySessionCookie(sessionCookie.value);
    return token as SessionDataT;
  } catch (error) {}
  return null;
});

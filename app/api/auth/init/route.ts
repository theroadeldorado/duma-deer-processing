import { ResponseError, ResponseJSON } from '@/lib/api';
import { auth } from 'lib/firebaseAdmin';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = request.headers.get('authorization');

    const result = await auth.verifyIdToken(token || '');
    if (!token || !result.uid) throw new Error();

    const expiresIn = 60 * 60 * 24 * 14 * 1000; //2 weeks
    const sessionCookie = await auth.createSessionCookie(token, { expiresIn });
    const options = { maxAge: expiresIn, httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' };
    cookieStore.set('session', sessionCookie, options);

    return ResponseJSON({ success: true });
  } catch (error) {
    return ResponseError('Unable to initialize session');
  }
}

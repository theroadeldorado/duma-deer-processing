import { ResponseError, ResponseJSON } from '@/lib/api';
import { auth } from 'lib/firebaseAdmin';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const expiresIn = 0;
    const options = { maxAge: expiresIn, httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' };
    cookieStore.set('session', '', options);

    return ResponseJSON({ success: true });
  } catch (error) {
    return ResponseError('Unable to initialize session');
  }
}

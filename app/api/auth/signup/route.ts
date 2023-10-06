import { ResponseError, ResponseJSON } from '@/lib/api';
import { auth } from 'lib/firebaseAdmin';
import { connect } from 'lib/mongo';
import Profile from 'models/Profile';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, password, name } = data;

    await connect();

    const exists = await Profile.exists({ email: email.toLowerCase() });

    if (exists) throw new Error('Email already in use');

    const user = await auth.createUser({ email, password, displayName: name });

    if (!user) throw new Error('Failed to create user');

    const profile = await Profile.create({
      ...data,
      email: email.toLowerCase(),
      uid: user.uid,
      role: 'user',
    });

    await auth.setCustomUserClaims(user.uid, {
      profileId: profile._id,
      role: 'user',
    });

    return ResponseJSON({ success: true });
  } catch (error) {
    return ResponseError(error);
  }
}

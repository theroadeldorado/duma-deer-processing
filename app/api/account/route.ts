import Profile from 'models/Profile';
import { connect } from 'lib/mongo';
import { ResponseError, ResponseJSON, NoAccessResponse, getSession } from '@/lib/api';
import { auth } from '@/lib/firebaseAdmin';

export async function PUT(request: Request) {
  try {
    const { name, email, password } = await request.json();
    const session = await getSession(true);
    if (!session) return NoAccessResponse;

    await connect();

    const profile = await Profile.findById(session.profileId);

    if (!profile) throw new Error('User not found');

    if (profile.uid) {
      await auth.updateUser(
        profile.uid,
        password ? { password, email: email.toLowerCase(), displayName: name } : { email: email.toLowerCase(), displayName: name }
      );
    }

    profile.name = name;
    profile.email = email;
    await profile.save();

    return ResponseJSON({ success: true });
  } catch (error) {
    return ResponseError(error);
  }
}

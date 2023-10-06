import { ResponseError, ResponseJSON } from '@/lib/api';
import { auth } from 'lib/firebaseAdmin';
import { connect } from 'lib/mongo';
import Profile from 'models/Profile';

export async function POST(request: Request) {
  try {
    const { password, inviteCode } = await request.json();
    await connect();

    const profile = await Profile.findOne({ inviteCode });
    if (!profile || !profile.email || !profile.uid) throw 'Invalid invite code';

    await Promise.all([auth.updateUser(profile.uid, { password }), Profile.updateOne({ inviteCode }, { inviteCode: null })]);

    return ResponseJSON({ success: true });
  } catch (error) {
    return ResponseError(error);
  }
}

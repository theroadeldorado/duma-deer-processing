import Profile from 'models/Profile';
import { connect } from 'lib/mongo';
import { ResponseError, ResponseJSON, NoAccessResponse, getSession } from '@/lib/api';
import { auth } from 'lib/firebaseAdmin';

export async function PATCH(request: Request, { params }: any) {
  try {
    const { id } = params;
    const { password } = await request.json();
    const session = await getSession(true);
    if (!session) return NoAccessResponse;

    await connect();

    const profile = await Profile.findById(id);
    if (!profile?.uid) throw new Error('User not found');
    await auth.updateUser(profile.uid, { password });

    return ResponseJSON({ success: true });
  } catch (error) {
    return ResponseError(error);
  }
}

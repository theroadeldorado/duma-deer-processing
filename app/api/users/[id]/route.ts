import Profile from 'models/Profile';
import { connect } from 'lib/mongo';
import { getSession, NoAccessResponse, ResponseError, ResponseJSON, safeData } from '@/lib/api';
import { auth } from 'lib/firebaseAdmin';
import { ProfileZ } from 'lib/zod';
import { z } from 'zod';

// Update user
export async function PUT(request: Request, { params }: any) {
  try {
    const session = await getSession(true);
    if (!session) return NoAccessResponse;

    const { id } = params;
    type DataT = z.infer<typeof ProfileZ>;
    const data = await safeData<DataT>(ProfileZ, request);

    await connect();
    const profile = await Profile.findById(id);

    if (!profile) throw new Error('User not found');

    if (profile.uid) {
      await auth.updateUser(profile.uid, { email: data.email.toLowerCase(), displayName: data.name });
      await auth.setCustomUserClaims(profile.uid, {
        profileId: profile._id,
        role: data.role,
      });
    }

    await Profile.updateOne({ _id: id }, data);
    return ResponseJSON({ success: true });
  } catch (error) {
    return ResponseError(error);
  }
}

// Delete user
export async function DELETE(request: Request, { params }: any) {
  try {
    const session = await getSession(true);
    if (!session) return NoAccessResponse;

    const { id } = params;
    const profile = await Profile.findById(id);
    if (!profile) throw new Error('User not found');
    await Profile.deleteOne({ _id: id });

    if (profile.uid) {
      await auth.deleteUser(profile.uid);
    }

    return ResponseJSON({ success: true });
  } catch (error) {
    return ResponseError(error);
  }
}

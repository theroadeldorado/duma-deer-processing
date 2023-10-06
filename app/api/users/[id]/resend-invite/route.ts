import Profile from 'models/Profile';
import { connect } from 'lib/mongo';
import { ResponseError, ResponseJSON, getSession, NoAccessResponse } from '@/lib/api';
import { sendTemplateEmail } from '@/lib/email';

export async function POST(request: Request, { params }: any) {
  try {
    const { id } = params;
    const session = await getSession(true);
    if (!session) return NoAccessResponse;

    await connect();

    const profile = await Profile.findById(id);
    if (!profile) throw new Error('User not found');

    await sendTemplateEmail({
      data: {
        resetPasswordLink: `${process.env.NEXT_PUBLIC_DOMAIN}/join/${profile.inviteCode}`,
        recipientName: profile.name,
      },
      key: 'inviteEmail',
      to: profile.email,
    });

    return ResponseJSON({ success: true });
  } catch (error) {
    return ResponseError(error);
  }
}

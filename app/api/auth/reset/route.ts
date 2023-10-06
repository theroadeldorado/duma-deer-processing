import { ResponseError, ResponseJSON } from '@/lib/api';
import { auth } from 'lib/firebaseAdmin';
import { connect } from 'lib/mongo';
import Profile from 'models/Profile';
import { sendTemplateEmail } from '@/lib/email';
import { env } from '@/env.mjs';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    await connect();

    const profile = await Profile.findOne({ email: email.toLowerCase() });
    if (!profile) throw new Error('No account found');

    const url = await auth.generatePasswordResetLink(email, {
      url: `${env.NEXT_PUBLIC_DOMAIN}/login`,
    });

    await sendTemplateEmail({
      data: {
        resetPasswordLink: url,
        recipientName: profile.name,
      },
      key: 'resetPassword',
      to: email,
    });

    return ResponseJSON({ success: true });
  } catch (error) {
    return ResponseError(error);
  }
}

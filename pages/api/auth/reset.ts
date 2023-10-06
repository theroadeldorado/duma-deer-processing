import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from 'lib/firebaseAdmin';
import Profile from 'models/Profile';
import { connect } from 'lib/mongo';
import { sendTemplateEmail } from '@/lib/email';
import { env } from '@/env.mjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const { email } = req.body;

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

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

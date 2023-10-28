import Profile from 'models/Profile';
import { connect } from 'lib/mongo';
import secureApi from 'lib/secureApi';
import { sendTemplateEmail } from '@/lib/email';

export default secureApi(async (req, res) => {
  const id = req.query.id as string;

  try {
    await connect();

    const profile = await Profile.findById(id);
    if (!profile) throw new Error('User not found');

    await sendTemplateEmail({
      data: {
        setPasswordLink: `${process.env.NEXT_PUBLIC_DOMAIN}/join/${profile.inviteCode}`,
        recipientName: profile.name,
      },
      key: 'inviteEmail',
      to: profile.email,
    });

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}, true);

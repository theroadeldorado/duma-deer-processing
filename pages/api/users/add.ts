import { auth } from 'lib/firebaseAdmin';
import Profile from 'models/Profile';
import { v4 as uuidv4 } from 'uuid';
import { sendTemplateEmail } from '@/lib/email';
import { ProfileZ, safeData } from 'lib/zod';
import { z } from 'zod';
import secureApi from 'lib/secureApi';
import { connect } from 'lib/mongo';

export default secureApi(async (req, res) => {
  try {
    type DataT = z.infer<typeof ProfileZ>;
    const data = await safeData<DataT>(ProfileZ, req.body);

    const { name, email } = data;
    const inviteCode = uuidv4();

    await connect();

    const user = await auth.createUser({ email, displayName: name });

    if (!user) {
      throw new Error('Failed to create user');
    }

    const profile = await Profile.create({
      uid: user.uid,
      inviteCode,
      ...data,
      email: email.toLowerCase(),
    });

    await auth.setCustomUserClaims(user?.uid, {
      profileId: profile._id,
      role: profile.role,
    });

    await sendTemplateEmail({
      data: {
        setPasswordLink: `${process.env.NEXT_PUBLIC_DOMAIN}/join/${inviteCode}`,
        recipientName: profile.name,
      },
      key: 'inviteEmail',
      to: email,
    });

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}, true);

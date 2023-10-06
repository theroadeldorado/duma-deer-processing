import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from 'lib/firebaseAdmin';
import Profile from 'models/Profile';
import { connect } from 'lib/mongo';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const data = req.body;
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

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

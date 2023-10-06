import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from 'lib/firebaseAdmin';
import Profile from 'models/Profile';
import { connect } from 'lib/mongo';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const { password, inviteCode } = req.body;
    await connect();
    const profile = await Profile.findOne({ inviteCode });

    if (!profile || !profile.email || !profile.uid) throw new Error('Invalid invite code');

    await Promise.all([auth.updateUser(profile.uid, { password }), Profile.updateOne({ inviteCode }, { inviteCode: null })]);

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

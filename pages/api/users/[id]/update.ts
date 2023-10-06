import { auth } from 'lib/firebaseAdmin';
import Profile from 'models/Profile';
import { ProfileZ, safeData } from 'lib/zod';
import { z } from 'zod';
import { connect } from 'lib/mongo';
import secureApi from 'lib/secureApi';

export default secureApi(async (req, res) => {
  const id = req.query.id as string;

  try {
    type DataT = z.infer<typeof ProfileZ>;
    const data = await safeData<DataT>(ProfileZ, req.body);

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

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}, true);

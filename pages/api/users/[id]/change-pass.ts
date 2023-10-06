import { auth } from 'lib/firebaseAdmin';
import Profile from 'models/Profile';
import { connect } from 'lib/mongo';
import secureApi from 'lib/secureApi';

export default secureApi(async (req, res) => {
  const id = req.query.id as string;
  const password = req.body.password as string;

  try {
    await connect();

    const profile = await Profile.findById(id);
    if (!profile?.uid) throw new Error('User not found');
    await auth.updateUser(profile.uid, { password });

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}, true);

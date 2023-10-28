import { auth } from 'lib/firebaseAdmin';
import Profile from 'models/Profile';
import { connect } from 'lib/mongo';
import secureApi from 'lib/secureApi';

export default secureApi(async (req, res) => {
  const { id }: any = req.query;
  try {
    await connect();

    const profile = await Profile.findById(id);
    if (!profile) throw new Error('User not found');
    await Profile.deleteOne({ _id: id });

    if (profile.uid) {
      await auth.deleteUser(profile.uid);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error deleting user' });
  }
}, true);

import { auth } from 'lib/firebaseAdmin';
import Profile from 'models/Profile';
import { connect } from 'lib/mongo';
import secureApi from 'lib/secureApi';

export default secureApi(async (req, res, session) => {
  const { name, email, password } = req.body;

  try {
    await connect();

    const profile = await Profile.findById(session.profileId);

    if (!profile) throw new Error('User not found');

    if (profile.uid) {
      await auth.updateUser(
        profile.uid,
        password ? { password, email: email.toLowerCase(), displayName: name } : { email: email.toLowerCase(), displayName: name }
      );
    }

    profile.name = name;
    profile.email = email;
    await profile.save();

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}, true);

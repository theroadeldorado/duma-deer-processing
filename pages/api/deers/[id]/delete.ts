import { auth } from 'lib/firebaseAdmin';
import Deer from 'models/Deer';
import { connect } from 'lib/mongo';
import secureApi from 'lib/secureApi';

export default secureApi(async (req, res) => {
  const { id }: any = req.query;
  try {
    await connect();

    const Deer = await Deer.findById(id);
    if (!Deer) throw new Error('Deer not found');
    await Deer.deleteOne({ tagNumber: id });

    if (Deer.tagNumber) {
      await auth.deleteUser(Deer.tagNumber);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error deleting deer' });
  }
}, true);

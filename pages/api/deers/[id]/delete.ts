import { connect } from 'lib/mongo';
import secureApi from 'lib/secureApi';
import Deer from 'models/Deer';

export default secureApi(async (req, res) => {
  const { id }: any = req.query;
  console.log('delete', id);
  try {
    await connect();

    const deer = await Deer.findById(id);
    if (!deer) throw new Error('Deer not found');

    await Deer.deleteOne({ _id: id });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting deer' });
  }
}, true);

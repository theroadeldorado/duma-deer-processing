import { connect } from 'lib/mongo';
import secureApi from 'lib/secureApi';
import Deer from 'models/Deer';

export default secureApi(async (req, res) => {
  const { id }: any = req.query;

  try {
    await connect();

    const deer = await Deer.findById(id);
    if (!deer) {
      res.status(404).json({ error: 'Deer not found' });
      return;
    }

    await Deer.deleteOne({ _id: id });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting deer', details: (error as Error).message });
  }
}, true);

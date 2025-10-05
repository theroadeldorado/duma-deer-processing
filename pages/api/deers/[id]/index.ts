import { connect } from 'lib/mongo';
import secureApi from 'lib/secureApi';
import Deer from 'models/Deer';
import { NextApiRequest, NextApiResponse } from 'next';

export default secureApi(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const id = req.query.id as string;

  try {
    await connect();
    const deer = await Deer.findById(id).lean();

    if (!deer) {
      return res.status(404).json({ error: 'Deer not found' });
    }

    res.status(200).json({ success: true, data: deer });
  } catch (error: any) {
    console.error('Error fetching deer:', error);
    res.status(500).json({ error: error.message });
  }
}, true);

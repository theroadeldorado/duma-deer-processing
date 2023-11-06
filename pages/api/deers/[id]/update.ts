import { connect } from 'lib/mongo';
import secureApi from 'lib/secureApi';
import Deer from 'models/Deer'; // Your Deer model
import { DeerZ, safeData } from 'lib/zod'; // Your Zod validation for deer
import { z } from 'zod';
import { NextApiRequest, NextApiResponse } from 'next';

export default secureApi(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const id = req.query.id as string;

  try {
    type DeerDataT = z.infer<typeof DeerZ>;
    const data = await safeData<DeerDataT>(DeerZ, req.body);

    await connect();
    const deer = await Deer.findById(id);

    if (!deer) {
      return res.status(404).json({ error: 'Deer not found' });
    }

    // Add your update logic here.
    // For example, you might want to prevent certain fields from being updated or handle specific updates in a custom way.

    await Deer.updateOne({ _id: id }, data);

    res.status(200).json({ success: true, message: 'Deer updated successfully' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}, true);

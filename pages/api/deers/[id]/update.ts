import { connect } from 'lib/mongo';
import secureApi from 'lib/secureApi';
import Deer from 'models/Deer'; // Your Deer model
import { DeerZ, safeData } from 'lib/zod'; // Your Zod validation for deer
import { DeerT } from 'lib/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default secureApi(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const id = req.query.id as string;

  try {
    const data = await safeData<DeerT>(DeerZ, req.body);

    await connect();
    const deer = await Deer.findById(id);

    if (!deer) {
      return res.status(404).json({ error: 'Deer not found' });
    }

    if (data.hasPrinted !== undefined) {
      deer.hasPrinted = data.hasPrinted;
    }

    // Add your update logic here.
    // For example, you might want to prevent certain fields from being updated or handle specific updates in a custom way.

    const updateResult = await Deer.updateOne({ _id: id }, data);

    // Debug: Verify the update worked
    const updatedDeer = await Deer.findById(id);

    res.status(200).json({ success: true, message: 'Deer updated successfully' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}, true);

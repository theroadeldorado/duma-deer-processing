import { connect } from 'lib/mongo';
import Deer from 'models/Deer';
import { DeerZ, safeData } from 'lib/zod';
import { DeerT } from 'lib/types';
import secureApi from 'lib/secureApi';

export default secureApi(async (req, res) => {
  try {
    const data = await safeData<DeerT>(DeerZ, req.body);

    await connect();

    const customId = `${data.tagNumber}-${Date.now()}`;

    const { _id, ...rest } = data;

    const newDeer = await Deer.create({
      _id: customId,
      ...rest,
    });

    res.status(200).json({ success: true, deer: newDeer });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}, true);

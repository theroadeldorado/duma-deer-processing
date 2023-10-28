import type { NextApiRequest, NextApiResponse } from 'next';
import DeerDropOff from 'models/DeerDropOff';
import { connect } from 'lib/mongo';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const data = req.body;
    await connect();
    const deerDropOff = await DeerDropOff.create({
      ...data,
    });
    res.status(200).json({ success: true });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

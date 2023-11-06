import type { NextApiRequest, NextApiResponse } from 'next';
import Deer from 'models/Deer'; // Imported model
import { connect } from 'lib/mongo';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const data = req.body;
    await connect();
    const newDeer = await Deer.create({
      ...data,
    });
    res.status(200).json({ success: true, deer: newDeer }); // Optionally return the created deer
  } catch (error: any) {
    console.error(error); // It's a better practice to use console.error for errors
    res.status(500).json({ error: error.message });
  }
}

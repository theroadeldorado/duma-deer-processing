import EmailTemplate from 'models/Profile';
import { EmailTemplateZ, safeData } from 'lib/zod';
import { z } from 'zod';
import { connect } from 'lib/mongo';
import secureApi from 'lib/secureApi';

export default secureApi(async (req, res) => {
  const id = req.query.id as string;

  try {
    await connect();

    type DataT = z.infer<typeof EmailTemplateZ>;
    const data = await safeData<DataT>(EmailTemplateZ, req.body);

    await EmailTemplate.updateOne({ _id: id }, data);

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}, true);

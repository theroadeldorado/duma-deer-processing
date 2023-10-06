import EmailTemplates from 'models/Profile';
import { connect } from 'lib/mongo';
import secureApi from 'lib/secureApi';

type QueryT = {
  search?: string;
  role?: string;
  sortBy?: string;
  sortDirection?: string;
  format?: string;
  page?: string;
};

export default secureApi(async (req, res) => {
  await connect();
  const { search, sortBy, sortDirection, page } = req.query as QueryT;
  const currentPage = Number(page) || 1;
  const query: any = {};

  if (search) {
    query.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
  }

  const [results, total] = await Promise.all([
    EmailTemplates.find(query)
      .limit(20)
      .skip(20 * (currentPage - 1))
      .sort(sortBy && sortDirection ? { [sortBy]: sortDirection === 'asc' ? 1 : -1 } : undefined),
    EmailTemplates.countDocuments(query),
  ]);

  res.status(200).json({ success: true, results, total });
}, true);

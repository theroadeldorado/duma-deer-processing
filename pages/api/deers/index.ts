import Deer from 'models/Deer';
import { connect } from 'lib/mongo';
import secureApi from 'lib/secureApi';
import { exportDeers } from 'lib/csv';

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
  const { search, role, sortBy, sortDirection, format, page } = req.query as QueryT;
  const currentPage = Number(page) || 1;
  const isCSV = format === 'csv';
  const query: any = {};

  if (search) {
    query.$or = [{ name: { $regex: search, $options: 'i' } }];
  }

  if (role) {
    query.role = role;
  }

  await connect();
  const [deers, total] = await Promise.all([
    Deer.find(query)
      .limit(isCSV ? 0 : 20)
      .skip(isCSV ? 0 : 20 * (currentPage - 1))
      .sort(sortBy && sortDirection ? { [sortBy]: sortDirection === 'asc' ? 1 : -1 } : undefined)
      .lean(),
    Deer.countDocuments(query),
  ]);

  if (isCSV) {
    try {
      const url = await exportDeers(deers);
      res.status(200).json({ success: true, url });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: 'Failed to export CSV' });
    }
  } else {
    res.status(200).json({ success: true, results: deers, total });
  }
}, true);

import Profile from 'models/Profile';
import { connect } from 'lib/mongo';
import secureApi from 'lib/secureApi';
import { exportUsers } from 'lib/csv';

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
    query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: search.toLowerCase() }];
  }

  if (role) {
    query.role = role;
  }

  await connect();
  const [profiles, total] = await Promise.all([
    Profile.find(query)
      .limit(isCSV ? 0 : 20)
      .skip(isCSV ? 0 : 20 * (currentPage - 1))
      .sort(sortBy && sortDirection ? { [sortBy]: sortDirection === 'asc' ? 1 : -1 } : undefined)
      .lean(),
    Profile.countDocuments(query),
  ]);

  if (isCSV) {
    try {
      const url = await exportUsers(profiles);
      res.status(200).json({ success: true, url });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: 'Failed to export CSV' });
    }
  } else {
    res.status(200).json({ success: true, results: profiles, total });
  }
}, true);

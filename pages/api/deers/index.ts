import Deer from 'models/Deer';
import { connect } from 'lib/mongo';
import secureApi from 'lib/secureApi';
import { exportDeers } from 'lib/csv';
import { DeerT } from 'lib/types';

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
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { tagNumber: { $regex: search, $options: 'i' } },
    ];
  }

  if (role) {
    query.role = role;
  }

  // Build the query with optional sorting and pagination
  const sortField = sortBy || 'createdAt';
  const sortDir = sortDirection === 'asc' ? 1 : -1;

  let deerQuery;

  if (isCSV) {
    // For CSV exports, fetch all data without MongoDB sorting (to avoid memory limits)
    // and sort in JavaScript after fetching
    deerQuery = Deer.find(query).lean();
  } else {
    // For paginated requests, use MongoDB sorting (smaller datasets)
    deerQuery = Deer.find(query)
      .limit(20)
      .skip(20 * (currentPage - 1))
      .sort({ [sortField]: sortDir })
      .lean();
  }

  const [rawDeers, total] = await Promise.all([deerQuery, Deer.countDocuments(query)]);

  // Sort in memory for CSV exports
  let deers = rawDeers;
  if (isCSV && sortField) {
    deers = [...rawDeers].sort((a: any, b: any) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return sortDir;
      if (bVal === null || bVal === undefined) return -sortDir;
      if (aVal < bVal) return -sortDir;
      return sortDir;
    });
  }

  if (isCSV) {
    try {
      console.log(`[CSV Export] Starting export of ${deers.length} deer records`);
      const url = await exportDeers(deers as DeerT[]);
      console.log(`[CSV Export] Export successful, URL generated`);
      res.status(200).json({ success: true, url });
    } catch (error: any) {
      console.error('[CSV Export] Export failed:', error?.message || error);
      console.error('[CSV Export] Stack:', error?.stack);
      res.status(500).json({
        success: false,
        error: 'Failed to export CSV',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      });
    }
  } else {
    res.status(200).json({ success: true, results: deers, total });
  }
}, true);

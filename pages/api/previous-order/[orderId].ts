import type { NextApiRequest, NextApiResponse } from 'next';
import Deer from 'models/Deer';
import { connect } from 'lib/mongo';
import { extractCustomerInfo, extractReorderPreferences } from '@/lib/reorderUtils';
import { DeerT } from '@/lib/types';

type ResponseData = {
  success: boolean;
  customerInfo?: Partial<DeerT>;
  preferences?: Partial<DeerT>;
  error?: string;
};

/**
 * Public API endpoint to fetch previous order preferences.
 * Returns processing preferences only (no financial data).
 *
 * GET /api/previous-order/[orderId]
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { orderId } = req.query;

  if (!orderId || typeof orderId !== 'string') {
    return res.status(400).json({ success: false, error: 'Order ID is required' });
  }

  try {
    await connect();

    const order = await Deer.findById(orderId).lean();

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Extract only the fields needed for reorder
    // Do NOT include financial data (prices, deposits, etc.)
    const customerInfo = extractCustomerInfo(order as DeerT);
    const preferences = extractReorderPreferences(order as DeerT);

    return res.status(200).json({
      success: true,
      customerInfo,
      preferences,
    });
  } catch (error) {
    console.error('Previous order fetch error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch order' });
  }
}

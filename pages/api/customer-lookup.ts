import type { NextApiRequest, NextApiResponse } from 'next';
import Deer from 'models/Deer';
import { connect } from 'lib/mongo';
import { normalizePhone, createPhoneRegex, isValidPhoneLength } from '@/lib/phoneUtils';
import { CustomerSummary } from '@/lib/types';

type ResponseData = {
  success: boolean;
  customers?: CustomerSummary[];
  error?: string;
};

/**
 * Public API endpoint to search for customers by phone number.
 * Returns minimal customer information for selection.
 *
 * POST /api/customer-lookup
 * Body: { phone: string }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { phone } = req.body;

  if (!phone || typeof phone !== 'string') {
    return res.status(400).json({ success: false, error: 'Phone number is required' });
  }

  const normalizedPhone = normalizePhone(phone);

  // Require at least 7 digits for a meaningful search
  if (normalizedPhone.length < 7) {
    return res.status(400).json({
      success: false,
      error: 'Please enter at least 7 digits of your phone number',
    });
  }

  try {
    await connect();

    // Build a regex pattern for flexible phone matching
    const phoneRegex = createPhoneRegex(phone);

    // Find all orders matching this phone number
    const orders = await Deer.find({ phone: phoneRegex })
      .sort({ createdAt: -1 }) // Most recent first
      .lean();

    if (!orders || orders.length === 0) {
      return res.status(200).json({ success: true, customers: [] });
    }

    // Group orders by customer (unique combination of phone + name)
    const customerMap = new Map<string, CustomerSummary>();

    for (const order of orders) {
      // Create a key based on normalized phone and name to identify unique customers
      const normalizedOrderPhone = normalizePhone(order.phone || '');
      // Build name from either the name field or firstName + lastName, normalized
      const orderName = (order.name || `${order.firstName || ''} ${order.lastName || ''}`)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' '); // Collapse multiple spaces
      const customerKey = `${normalizedOrderPhone}-${orderName}`;

      // Only keep the first (most recent) order for each customer
      if (!customerMap.has(customerKey)) {
        customerMap.set(customerKey, {
          name: order.name || '',
          phone: order.phone || '',
          address: order.address || '',
          city: order.city || '',
          state: order.state || '',
          zip: order.zip?.toString() || '',
          fullAddress: order.fullAddress || `${order.address}, ${order.city}, ${order.state} ${order.zip}`,
          lastOrderId: order._id?.toString() || '',
          lastOrderDate: order.createdAt?.toISOString?.() || order.createdAt?.toString() || '',
          communication: order.communication || '',
        });
      }
    }

    const customers = Array.from(customerMap.values());

    return res.status(200).json({ success: true, customers });
  } catch (error) {
    console.error('Customer lookup error:', error);
    return res.status(500).json({ success: false, error: 'Failed to search for customers' });
  }
}

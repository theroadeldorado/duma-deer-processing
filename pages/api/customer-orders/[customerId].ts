import type { NextApiRequest, NextApiResponse } from 'next';
import Deer from 'models/Deer';
import { connect } from 'lib/mongo';
import { createPhoneRegex } from '@/lib/phoneUtils';
import { extractReorderPreferences } from '@/lib/reorderUtils';
import { DeerT } from '@/lib/types';

/**
 * Fields to compare when determining if two orders have different preferences
 */
const PREFERENCE_FIELDS = [
  'skinnedOrBoneless',
  'cape',
  'hide',
  'euroMount',
  'backStrapsPreference',
  'hindLegPreference1',
  'hindLegPreference2',
  'hindLegJerky1Flavor',
  'hindLegJerky2Flavor',
  'tenderizedCubedSteaks',
  'roast',
  'groundVenison',
  'groundVenisonAmount',
  // Specialty meats
  'trailBolognaRegular',
  'trailBolognaCheddarCheese',
  'trailBolognaHotPepperJackCheese',
  'smokedJalapenoCheddarBrats',
  'garlicRingBologna',
  'summerSausageMild',
  'summerSausageHot',
  'smokedKielbasaSausage',
  'italianSausageLinksMild',
  'italianSausageLinksHot',
  'countryBreakfastSausage',
  'babyLinksCountry',
  'babyLinksMaple',
  'snackSticksRegular',
  'snackSticksCheddarCheese',
  'snackSticksHotPepperJackCheese',
  'snackSticksHotHotPepperJackCheese',
  'snackSticksHoneyBBQ',
  'hotDogsRegular',
  'hotDogsCheddarCheese',
  'hotDogsHotPepperJackCheese',
  'jerkyRestructuredHot',
  'jerkyRestructuredMild',
  'jerkyRestructuredTeriyaki',
];

/**
 * Generate a fingerprint for an order's preferences
 * Used to identify unique preference sets
 */
function generatePreferenceFingerprint(order: any): string {
  const values: string[] = [];

  for (const field of PREFERENCE_FIELDS) {
    const value = order[field];
    // Normalize falsy values
    if (value === undefined || value === null || value === '' || value === 'false' || value === false || value === 0 || value === '0') {
      values.push('');
    } else {
      values.push(String(value).toLowerCase().trim());
    }
  }

  return values.join('|');
}

type OrderSummary = {
  orderId: string;
  orderDate: string;
  preferences: Record<string, any>;
};

type ResponseData = {
  success: boolean;
  orders?: OrderSummary[];
  error?: string;
};

/**
 * Get all unique order preferences for a customer
 *
 * GET /api/customer-orders/[customerId]
 * customerId format: phone-name (normalized)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { customerId } = req.query;

  if (!customerId || typeof customerId !== 'string') {
    return res.status(400).json({ success: false, error: 'Customer ID is required' });
  }

  // Parse customerId (format: phone-name)
  const [phone, ...nameParts] = customerId.split('-');
  const name = nameParts.join('-'); // Rejoin in case name had dashes

  if (!phone) {
    return res.status(400).json({ success: false, error: 'Invalid customer ID format' });
  }

  try {
    await connect();

    // Find all orders for this customer using flexible phone matching
    const phoneRegex = createPhoneRegex(phone);
    const orders = (await Deer.find({
      phone: { $regex: phoneRegex },
    })
      .sort({ createdAt: -1 })
      .lean()) as DeerT[];

    console.log(`[customer-orders] Phone: ${phone}, Regex: ${phoneRegex}, Name: ${name}`);
    console.log(`[customer-orders] Found ${orders.length} orders by phone`);

    if (!orders || orders.length === 0) {
      return res.status(200).json({ success: true, orders: [] });
    }

    // Filter to orders matching this specific customer name
    const customerOrders = orders.filter((order) => {
      const orderName = (order.name || `${order.firstName || ''} ${order.lastName || ''}`)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');
      return orderName === name.replace(/\s+/g, ' ');
    });

    console.log(`[customer-orders] Filtered to ${customerOrders.length} orders for "${name}"`);

    // Group by unique preferences
    const uniquePreferences = new Map<string, OrderSummary>();

    for (const order of customerOrders) {
      const fingerprint = generatePreferenceFingerprint(order);

      console.log(`[customer-orders] Order ${order._id}: backStraps=${order.backStrapsPreference}, trailBolognaCheddar=${order.trailBolognaCheddarCheese}, snackSticksCheddar=${order.snackSticksCheddarCheese}, snackSticksHotPepper=${order.snackSticksHotPepperJackCheese}`);
      console.log(`[customer-orders] Fingerprint: ${fingerprint.substring(0, 100)}...`);

      // Only keep the most recent order for each unique preference set
      if (!uniquePreferences.has(fingerprint)) {
        uniquePreferences.set(fingerprint, {
          orderId: order._id?.toString() || '',
          orderDate: order.createdAt?.toISOString?.() || order.createdAt?.toString() || '',
          preferences: extractReorderPreferences(order),
        });
      }
    }

    const uniqueOrders = Array.from(uniquePreferences.values());

    console.log(`[customer-orders] Returning ${uniqueOrders.length} unique orders`);

    return res.status(200).json({ success: true, orders: uniqueOrders });
  } catch (error) {
    console.error('Customer orders fetch error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
}

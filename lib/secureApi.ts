import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from 'lib/firebaseAdmin';
import nookies from 'nookies';
import { RoleType } from 'lib/enums';
import { SessionDataT } from '@/lib/types';

type Callback = (req: NextApiRequest, res: NextApiResponse, session: SessionDataT) => Promise<void>;

export default function secureApi(callback: Callback, requireAdmin?: boolean) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const cookies = nookies.get({ req });
    const token = cookies.session;

    let result = null;
    try {
      result = await auth.verifySessionCookie(token || '');
    } catch (error) {}

    if (requireAdmin && result?.role !== RoleType.ADMIN) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    } else if (!result?.uid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    return await callback(req, res, { ...result, isAdmin: result?.role === RoleType.ADMIN });
  };
}

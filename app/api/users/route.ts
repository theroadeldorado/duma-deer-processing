import Profile from 'models/Profile';
import { connect } from 'lib/mongo';
import { getSession, NoAccessResponse, ResponseError, ResponseJSON, getParams, safeData } from '@/lib/api';
import { exportUsers } from 'lib/csv';
import { v4 as uuidv4 } from 'uuid';
import { sendTemplateEmail } from '@/lib/email';
import { auth } from 'lib/firebaseAdmin';
import { ProfileZ } from 'lib/zod';
import { z } from 'zod';

// Invite user
export async function POST(request: Request) {
  try {
    const session = await getSession(true);
    if (!session) return NoAccessResponse;

    type DataT = z.infer<typeof ProfileZ>;
    const data = await safeData<DataT>(ProfileZ, request);

    const { name, email } = data;
    const inviteCode = uuidv4();

    await connect();

    const user = await auth.createUser({ email, displayName: name });

    if (!user) {
      throw new Error('Failed to create user');
    }

    const profile = await Profile.create({
      uid: user.uid,
      inviteCode,
      ...data,
      email: email.toLowerCase(),
    });

    await auth.setCustomUserClaims(user?.uid, {
      profileId: profile._id,
      role: profile.role,
    });

    await sendTemplateEmail({
      data: {
        resetPasswordLink: `${process.env.NEXT_PUBLIC_DOMAIN}/join/${inviteCode}`,
        recipientName: profile.name,
      },
      key: 'inviteEmail',
      to: email,
    });

    return ResponseJSON({ success: true });
  } catch (error) {
    return ResponseError(error);
  }
}

// Get users
export async function GET(request: Request) {
  const session = await getSession(true);
  if (!session) return NoAccessResponse;

  const { search, role, sortBy, sortDirection, format, page } = getParams(request);
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
      return ResponseJSON({ success: true, url });
    } catch (error) {
      return ResponseError(error);
    }
  } else {
    return ResponseJSON({ success: true, results: profiles, total });
  }
}

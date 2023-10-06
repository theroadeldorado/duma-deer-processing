import { NoAccessResponse, ResponseJSON, getParams, getSession } from '@/lib/api';
import { connect } from '@/lib/mongo';
import EmailTemplates from '@/models/EmailTemplate';

export async function GET(request: Request) {
  const session = await getSession(true);
  if (!session) return NoAccessResponse;

  const { search, sortBy, sortDirection, page } = getParams(request);
  const currentPage = Number(page) || 1;
  const query: any = {};

  await connect();

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

  return ResponseJSON({ results, total });
}

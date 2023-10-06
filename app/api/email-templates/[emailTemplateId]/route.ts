import { NoAccessResponse, ResponseError, ResponseJSON, getSession, safeData } from '@/lib/api';
import { EmailTemplateZ } from '@/lib/zod';
import EmailTemplate from '@/models/EmailTemplate';
import { connect } from 'lib/mongo';
import { z } from 'zod';

export type ParamsT = { emailTemplateId: string };
export type PutRequestInputT = z.infer<typeof EmailTemplateZ>;
export async function PUT(request: Request, { params }: { params: ParamsT }) {
  const session = await getSession(true);
  if (!session) return NoAccessResponse;

  try {
    await connect();

    type DataT = z.infer<typeof EmailTemplateZ>;
    const data = await safeData<DataT>(EmailTemplateZ, request);

    await EmailTemplate.updateOne({ _id: params.emailTemplateId }, data);
    return ResponseJSON({ success: true });
  } catch (error) {
    return ResponseError(error);
  }
}

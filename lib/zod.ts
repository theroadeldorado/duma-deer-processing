import { z, Schema } from 'zod';
import { EmailTemplateSchemaT, ProfileSchemaT } from '@/lib/types';

export const safeData = async <ResultType>(zodSchema: Schema, data: any) => {
  const safeInput = zodSchema.safeParse(data);
  if (!safeInput.success) throw safeInput.error.message;
  return safeInput.data as ResultType;
};

export const Profile: Omit<ProfileSchemaT, 'inviteCode' | 'uid'> = {
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'This field is required'),
  role: z.string().min(1, 'This field is required'),
};

export const ProfileZ = z.object(Profile);

const EmailTemplate: Omit<EmailTemplateSchemaT, 'key' | 'vars'> = {
  name: z.string(),
  description: z.string().optional(),
  subject: z.string(),
  body: z.string(),
};
export const EmailTemplateZ = z.object(EmailTemplate);

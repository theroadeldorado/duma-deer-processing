import { RoleType, EmailVar } from '@/lib/enums';

export type KeyValueT = {
  [key: string]: any;
};

export type ProfileT = {
  _id: string;
  uid: string;
  email: string;
  name: string;
  role: RoleType;
  inviteCode: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProfileInputT = Omit<ProfileT, '_id' | 'uid' | 'createdAt' | 'updatedAt' | 'inviteCode'>;
export type ProfileSchemaT = Record<keyof Omit<ProfileT, '_id' | 'updatedAt' | 'createdAt'>, any>;

export type SessionDataT = {
  uid: string;
  profileId: string;
  role: RoleType;
};

export type FileT = {
  filename: string;
  ext?: string;
  path: string;
  url: string;
  size: number;
};

export type EmailTemplateT = {
  _id: string;
  key: string;
  name: string;
  description?: string;
  subject: string;
  body: string;
  vars: EmailVar[];
};

export type EmailTemplateSchemaT = Record<keyof Omit<EmailTemplateT, '_id' | 'createdAt' | 'updatedAt'>, any>;

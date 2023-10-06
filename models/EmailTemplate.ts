import { EmailTemplateT, EmailTemplateSchemaT } from '@/lib/types';
import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const EmailTemplateSchemaFields: EmailTemplateSchemaT = {
  key: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  vars: {
    type: Array,
    default: [],
  },
};

const EmailTemplateSchema = new Schema(EmailTemplateSchemaFields, { timestamps: true });

const EmailTemplate = models?.EmailTemplate || model('EmailTemplate', EmailTemplateSchema);

export default EmailTemplate as mongoose.Model<EmailTemplateT>;

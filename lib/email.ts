import sendgrid from '@sendgrid/mail';
import { env } from '@/env.mjs';
import { siteName } from 'config';
import { EmailVar, EmailVarCode } from '@/lib/enums';
import { connect } from '@/lib/mongo';
import EmailTemplate from '@/models/EmailTemplate';

sendgrid.setApiKey(env.SENDGRID_API || '');

type Props = {
  subject: string;
  to: string | string[];
  html?: string;
  text?: string;
  replyTo?: string;
};

export async function sendEmail({ subject, to, html, text, replyTo: customReplyTo }: Props) {
  const from = `${siteName} <${env.SENDGRID_FROM_EMAIL}>`;
  const replyTo = customReplyTo || env.SENDGRID_FROM_EMAIL;
  const data = html ? { from, to, subject, html, replyTo } : { from, to, subject, text: text || '', replyTo };
  await sendgrid.send(data);
}

type TemplateProps = {
  key: string;
  to: string | string[];
  data: any;
};

export async function sendTemplateEmail({ key, to, data }: TemplateProps) {
  const from = `${siteName} <${env.SENDGRID_FROM_EMAIL}>`;
  const replyTo = env.SENDGRID_REPLY_TO_EMAIL;
  await connect();
  const template = await EmailTemplate.findOne({ key });
  if (!template) throw new Error('Email template not found');

  const subject = replaceVars({
    content: template.subject,
    vars: template.vars,
    data,
  });

  let body = replaceVars({
    content: template.body,
    vars: template.vars,
    data,
  });

  try {
    const response = await sendgrid.send({ from, to, subject, html: body, replyTo });
    console.log(response);
  } catch (error: any) {
    console.error(error.message);
  }
}

type ReplaceVarProps = {
  content: string;
  data: any;
  vars: EmailVar[];
};

const replaceVars = ({ content, data, vars }: ReplaceVarProps) => {
  let newContent = content.replaceAll('\r', '<br />').replaceAll('\n', '<br />');

  vars.forEach((varName) => {
    const code = EmailVarCode[varName];
    if (!code) throw new Error(`Invalid email variable: ${varName}`);
    let replaceWith = data[varName];
    if (!replaceWith) throw new Error(`Missing data for email variable: ${varName}`);

    if (varName === EmailVar.SetPasswordLink) {
      replaceWith = `<a href="${replaceWith}">Set Password</a>`;
    } else if (varName === EmailVar.ResetPasswordLink) {
      replaceWith = `<a href="${replaceWith}">Reset Password</a>`;
    }

    newContent = newContent.replaceAll(code, replaceWith);
  });

  return newContent;
};

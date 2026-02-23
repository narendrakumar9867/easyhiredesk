import { EmailTemplate } from '@/src/types/rounds';

export const parseEmail = (emailText: string): EmailTemplate => {
  const lines = emailText.split('\n');
  const subject = lines[0].replace('Subject: ', '').trim();
  const body = lines.slice(2).join('\n').trim();
  return { subject, body };
};

export const formatEmailForDisplay = (email: EmailTemplate): string => {
  return `Subject: ${email.subject}\n\n${email.body}`;
};
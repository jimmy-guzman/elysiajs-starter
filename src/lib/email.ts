import { Resend } from "resend";

import env from "./env";

const resend = new Resend(env.RESEND_API_KEY);

interface SendEmailOptions {
  html: string;
  subject: string;
  to: string;
}

export async function sendEmail({ html, subject, to }: SendEmailOptions) {
  await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    html,
    subject,
    to,
  });
}

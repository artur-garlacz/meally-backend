import { AppConfig } from '@notify/utils/config';
import nodemailer, { Transporter } from 'nodemailer';
import path from 'path';
import hbs from 'nodemailer-express-handlebars';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export type CreateMailConfig = Pick<AppConfig, 'mailConfig'>;
export type MailClient = Awaited<ReturnType<typeof createMailClient>>;

export async function createMailClient({ mailConfig }: CreateMailConfig) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: mailConfig.gmailUser,
      pass: mailConfig.gmailPassword,
    },
  });

  transporter.use(
    'compile',
    hbs({
      viewEngine: {
        partialsDir: path.resolve('./src/templates/'),
        defaultLayout: false,
      },
      viewPath: path.resolve('./src/templates/'),
    }),
  );

  return { transporter };
}

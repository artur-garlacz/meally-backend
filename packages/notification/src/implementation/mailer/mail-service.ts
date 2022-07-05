import { uuid } from '@lib/utils/common';
import logger from '@lib/utils/logger';
import { MailTemplate } from '@notify/templates';
import Mail from 'nodemailer/lib/mailer';
import { AppServices } from '../app-services';

export type MailService = ReturnType<typeof createMailService>;

type ReverseMap<T> = T[keyof T];

export function createMailService({
  mailClient,
  dbClient,
}: Pick<AppServices, 'mailClient' | 'dbClient'>) {
  async function sendMail(
    mailOptions: Mail.Options & {
      template: ReverseMap<typeof MailTemplate>;
      context: any;
    },
  ) {
    const emailId = uuid();

    await dbClient.createEmail({
      emailId,
      sendTo: mailOptions?.to! as string,
      createdAt: new Date(),
    });

    mailClient.transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        // update row in db failed :/
        await dbClient.updateEmail({
          emailId,
          erroredAt: new Date(),
        });

        logger.error('Received error message', error);
        return console.log(error);
      }

      // update row in db
      await dbClient.updateEmail({
        emailId,
        sentAt: new Date(),
      });

      logger.info('Message sent: ' + info.response);
    });
  }

  return { sendMail };
}

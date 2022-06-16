import { AppServices } from '@notify/implementation/app-services';
import { ConsumedChannelData, QueueChannels } from '@lib/commons/queue';
import logger from '@lib/utils/logger';

export const offerChannel = async (app: AppServices) => {
  const { channel } = app.queueClient;

  await channel.assertQueue(QueueChannels.offer, { durable: true });

  await channel.consume(QueueChannels.offer, async (data) => {
    logger.info(`[USER CHANNEL]: Received ${Buffer.from(data!.content)}`);

    if (data) {
      const user: ConsumedChannelData<{ email: string }> = JSON.parse(
        data.content.toString('utf-8'),
      );

      const mailOptions = {
        from: '"Meally" <garlacz.artur@gmail.com>',
        to: user.data.email,
        subject: 'Welcome!',
        template: 'welcome-mail',
        context: {
          name: 'Archie',
        },
      };

      app.mailClient.transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return console.log(error);
        }

        logger.info('Message sent: ' + info.response);
      });
    }

    channel.ack(data!);
  });
};

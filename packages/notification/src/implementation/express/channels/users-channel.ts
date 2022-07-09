import { ConsumedChannelData, QueueChannels } from '@lib/commons/queue';
import logger from '@lib/utils/logger';
import { UseChannelServices } from '.';

export const userChannel = async (app: UseChannelServices) => {
  const { channel } = app.queueClient;

  await channel.assertQueue(QueueChannels.user, { durable: true });

  await channel.consume(QueueChannels.user, async (data) => {
    logger.info(`[USER CHANNEL]: Received ${Buffer.from(data!.content)}`);

    if (data) {
      const user: ConsumedChannelData<{ email: string }> = JSON.parse(
        data.content.toString('utf-8'),
      );

      app.mailService.sendMail({
        from: '"Meally" <garlacz.artur@gmail.com>',
        to: user.data.email,
        subject: 'Welcome!',
        template: 'welcome-mail',
        context: {
          name: 'Archie',
        },
      });

      // app.mailClient.transporter.sendMail(mailOptions, function (error, info) {
      //   if (error) {
      //     return console.log(error);
      //     // update row in db failed :/
      //   }

      //   logger.info('Message sent: ' + info.response);

      //   // update row in db
      // });
    }

    channel.ack(data!);
  });
};

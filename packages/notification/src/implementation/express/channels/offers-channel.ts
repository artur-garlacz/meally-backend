import { OfferEntity } from '@app/modules/offers/domain/entities';
import {
  ConsumedChannelData,
  QueueChannels,
  QueueCommands,
} from '@lib/commons/queue';
import logger from '@lib/utils/logger';
import { MailTemplate } from '@notify/templates';
import { UseChannelServices } from '.';

export const offerChannel = async (app: UseChannelServices) => {
  const { channel } = app.queueClient;

  await channel.assertQueue(QueueChannels.offer, { durable: true });

  await channel.consume(QueueChannels.offer, async (data) => {
    logger.info(`[OFFER CHANNEL]: Received ${Buffer.from(data!.content)}`);

    if (data) {
      const offer: ConsumedChannelData<OfferEntity & { email: string }> =
        JSON.parse(data.content.toString('utf-8'));

      // offer.type === QueueCommands.created;

      app.mailService.sendMail({
        from: '"Meally" <garlacz.artur@gmail.com>',
        to: offer.data.email,
        subject: 'Offer created!',
        template: 'offer-created-mail',
        context: {
          title: offer.data.title,
          status: offer.data.status,
          longDesc: offer.data.longDesc,
        },
      });

      // app.mailClient.transporter.sendMail(mailOptions, function (error, info) {
      //   if (error) {
      //     return console.log(error);
      //   }

      //   logger.info('Message sent: ' + info.response);
      // });
    }

    channel.ack(data!);
  });
};

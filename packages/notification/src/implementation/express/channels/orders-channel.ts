import {
  ConsumedChannelData,
  CreatedOrderEvent,
  QueueChannels,
  QueueCommands,
} from '@lib/commons/queue';
import logger from '@lib/utils/logger';
import { MailTemplate } from '@notify/templates';
import { UseChannelServices } from '.';

export const orderChannel = async (app: UseChannelServices) => {
  const { channel } = app.queueClient;

  await channel.assertQueue(QueueChannels.order, { durable: true });

  await channel.consume(QueueChannels.order, async (data) => {
    logger.info(`[ORDER CHANNEL]: Received ${Buffer.from(data!.content)}`);

    if (data) {
      const order: ConsumedChannelData<CreatedOrderEvent> = JSON.parse(
        data.content.toString('utf-8'),
      );

      if (order.type === QueueCommands.created) {
        if (order.data.orderType === 'customer') {
          app.mailService.sendMail({
            from: '"Meally" <garlacz.artur@gmail.com>',
            to: order.data.email,
            subject: 'Order created!',
            template: 'order-created-customer-mail',
            context: {
              title: order.data.title,
              totalPrice: order.data.totalPrice,
            },
          });
        } else {
          app.mailService.sendMail({
            from: '"Meally" <garlacz.artur@gmail.com>',
            to: order.data.email,
            subject: 'New order!',
            template: 'order-created-merchant-mail',
            context: {},
          });
        }
      }

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

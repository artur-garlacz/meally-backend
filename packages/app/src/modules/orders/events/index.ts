import { QueueClient } from '@app/libs/queue';

import {
  CreatedOrderEvent,
  QueueChannels,
  QueueCommands,
} from '@lib/commons/queue';
import logger from '@lib/utils/logger';
import { serializeJson } from '@lib/utils/serialization';

export function ordersEvents(queueClient: QueueClient) {
  return Object.freeze({
    async createdOrder(data: CreatedOrderEvent): Promise<void> {
      await queueClient.channel.assertQueue(QueueChannels.order);
      queueClient.channel.sendToQueue(
        QueueChannels.order,
        Buffer.from(
          serializeJson({
            data,
            type: QueueCommands.created,
          }),
        ),
      );
      logger.info('[Action] Created order data sent to queue');
    },
    async updatedOrder(data: any): Promise<void> {
      await queueClient.channel.assertQueue(QueueChannels.order);
      queueClient.channel.sendToQueue(
        QueueChannels.order,
        Buffer.from(serializeJson({ data, type: QueueCommands.updated })),
      );
      logger.info('[Action] Updated order data sent to queue');
    },
  });
}

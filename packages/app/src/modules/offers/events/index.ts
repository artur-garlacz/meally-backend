import { QueueClient } from '@app/libs/queue';

import { QueueChannels, QueueCommands } from '@lib/commons/queue';
import logger from '@lib/utils/logger';
import { serializeJson } from '@lib/utils/serialization';

export function offersEvents(queueClient: QueueClient) {
  return Object.freeze({
    async createdOffer(data: any): Promise<void> {
      await queueClient.channel.assertQueue(QueueChannels.offer);
      queueClient.channel.sendToQueue(
        QueueChannels.offer,
        Buffer.from(
          serializeJson({
            data,
            type: QueueCommands.created,
          }),
        ),
      );
      logger.info('[Action] Created offer data sent to queue');
    },
    async updatedOffer(data: any): Promise<void> {
      await queueClient.channel.assertQueue(QueueChannels.offer);
      queueClient.channel.sendToQueue(
        QueueChannels.offer,
        Buffer.from(serializeJson({ data, type: QueueCommands.updated })),
      );
      logger.info('[Action] Updated offer data sent to queue');
    },
  });
}

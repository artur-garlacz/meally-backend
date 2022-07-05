import { QueueChannels, QueueCommands } from '@lib/commons/queue';
import logger from '@lib/utils/logger';

import { UserEntity } from '@app/modules/users/domain/entities';

import { QueueClient } from '.';
import { serializeJson } from '../utils/serialization';

export type QueueEmitter = ReturnType<typeof buildEmiter>;

export type EmailEvent = { email: string };

export function buildEmiter(queueClient: QueueClient) {
  async function emitUserEvent(user: UserEntity) {
    await queueClient.channel.assertQueue(QueueChannels.user);
    queueClient.channel.sendToQueue(
      QueueChannels.user,
      Buffer.from(serializeJson({ data: user, type: QueueCommands.created })),
    );
    logger.info('[Action] User action sent to queue');
  }

  async function emitOfferEvent<T extends EmailEvent>(
    data: T,
    type: QueueCommands,
  ) {
    await queueClient.channel.assertQueue(QueueChannels.offer);
    queueClient.channel.sendToQueue(
      QueueChannels.offer,
      Buffer.from(
        serializeJson({
          data,
          type,
        }),
      ),
    );
    logger.info('[Action] Offer action sent to queue');
  }

  async function emitOrderEvent<T extends EmailEvent>(
    data: T,
    type: QueueCommands,
  ) {
    await queueClient.channel.assertQueue(QueueChannels.order);
    queueClient.channel.sendToQueue(
      QueueChannels.order,
      Buffer.from(
        serializeJson({
          data,
          type,
        }),
      ),
    );
    logger.info('[Action] Order action sent to queue');
  }

  return {
    emitUserEvent,
    emitOfferEvent,
    emitOrderEvent,
  };
}

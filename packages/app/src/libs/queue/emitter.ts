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
    logger.info('[Action] User created sent to queue');
  }

  async function emitOfferEvent<T extends EmailEvent>(data: T) {
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
    logger.info('[Action] Offer created sent to queue');
  }

  return {
    emitUserEvent,
    emitOfferEvent,
  };
}

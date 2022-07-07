import { QueueClient } from '@app/libs/queue';

import { QueueChannels, QueueCommands } from '@lib/commons/queue';
import logger from '@lib/utils/logger';
import { serializeJson } from '@lib/utils/serialization';

import { UserEntity } from '../domain/entities';

export function usersEvents(queueClient: QueueClient) {
  return Object.freeze({
    async createdUser(user: UserEntity): Promise<void> {
      await queueClient.channel.assertQueue(QueueChannels.user);
      queueClient.channel.sendToQueue(
        QueueChannels.user,
        Buffer.from(serializeJson({ data: user, type: QueueCommands.created })),
      );
      logger.info('[Action] Created user data sent to queue');
    },
    async updatedUserDetails(user: UserEntity) {
      await queueClient.channel.assertQueue(QueueChannels.user);
      queueClient.channel.sendToQueue(
        QueueChannels.user,
        Buffer.from(serializeJson({ data: user, type: QueueCommands.updated })),
      );
      logger.info('[Action] Updated user data sent to queue');
    },
  });
}

import { offersEvents } from '@app/modules/offers/events';
import { ordersEvents } from '@app/modules/orders/events';
import { usersEvents } from '@app/modules/users/events';

import { QueueClient } from '.';

export type QueueEmitter = ReturnType<typeof buildEmiter>;

export type EmailEvent = { email: string };

export function buildEmiter(queueClient: QueueClient) {
  return Object.freeze({
    ...usersEvents(queueClient),
    ...offersEvents(queueClient),
    ...ordersEvents(queueClient),
  });
}

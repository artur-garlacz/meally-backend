import { AppServices } from '@notify/implementation/app-services';

import { offerChannel } from './offers-channel';
import { userChannel } from './users-channel';

export type UseChannelServices = Pick<AppServices, 'mailClient' | 'queueClient'>;

export async function useChannels(app: UseChannelServices) {
  await userChannel(app);
  await offerChannel(app);
}

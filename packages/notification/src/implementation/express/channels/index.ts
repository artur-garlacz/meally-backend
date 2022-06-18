import { AppServices } from '@notify/implementation/app-services';

import { offerChannel } from './offers-channel';
import { userChannel } from './users-channel';

export async function useChannels(app: AppServices) {
  await userChannel(app);
  await offerChannel(app);
}

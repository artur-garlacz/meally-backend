// import { QueueClient, createQueueClient } from '@libs/queue';
import { AppConfig, getAppConfig } from '@notify/utils/config';
import logger from '@lib/utils/logger';
import { createQueueClient, QueueClient } from './queue';
import { createMailClient, MailClient } from './mailer';
import { useChannels } from './express/channels';

export type AppServices = {
  appConfig: AppConfig;
  dbClient: any;
  queueClient: QueueClient;
  mailClient: MailClient;
};

export const buildAppServices = async (
  args: Partial<AppServices> = {},
): Promise<AppServices> => {
  logger.info('Building app services');
  const appConfig = args.appConfig || (await getAppConfig());

  const dbClient = args.dbClient;
  const queueClient = await createQueueClient();
  const mailClient = await createMailClient(appConfig);

  useChannels({ queueClient, mailClient });

  return {
    appConfig,
    dbClient,
    queueClient,
    mailClient,
  };
};

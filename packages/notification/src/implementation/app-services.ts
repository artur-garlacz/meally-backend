// import { QueueClient, createQueueClient } from '@libs/queue';
import { AppConfig, getAppConfig } from '@notify/utils/config';
import logger from '@lib/utils/logger';
import { createQueueClient } from './queue';

export type AppServices = {
  appConfig: AppConfig;
  dbClient: any;
  queueClient: any;
};

export const buildAppServices = async (
  args: Partial<AppServices> = {},
): Promise<AppServices> => {
  logger.info('Building app services');
  const appConfig = args.appConfig || (await getAppConfig());

  const dbClient = args.dbClient;
  const queueClient = await createQueueClient();

  return {
    appConfig,
    dbClient,
    queueClient,
  };
};

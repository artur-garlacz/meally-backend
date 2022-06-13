import {
  CognitoClient,
  createCognitoClient,
} from '@clients/aws/cognito-client';

import { DbClient, createDbClient } from '@libs/db';
import { createDbPool } from '@libs/db/setup';
import { QueueClient, createQueueClient } from '@libs/queue';
import { AppConfig, getAppConfig } from '@libs/utils/config';
import logger from '@libs/utils/logger';

export type AppServices = {
  appConfig: AppConfig;
  dbClient: DbClient;
  queueClient: QueueClient;
  // cognitoClient: any;
};

export const buildAppServices = async (
  args: Partial<AppServices> = {},
): Promise<AppServices> => {
  logger.info('Building app services');
  const appConfig = args.appConfig || (await getAppConfig());

  const dbClient =
    args.dbClient || (await createDbClient(await createDbPool(appConfig)));
  // const cognitoClient = args.cognitoClient || createCognitoClient(appConfig);
  const queueClient = await createQueueClient();

  return {
    appConfig,
    dbClient,
    queueClient,
    // cognitoClient,
  };
};

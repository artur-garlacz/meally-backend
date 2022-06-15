import { DbClient, createDbClient } from '@app/libs/db';
import { createDbPool } from '@app/libs/db/setup';
import { QueueClient, createQueueClient } from '@app/libs/queue';
import { AppConfig, getAppConfig } from '@app/libs/utils/config';

import logger from '@lib/utils/logger';

import { SwaggerClient, createSwaggerClient } from './libs/swagger';

export type AppServices = {
  appConfig: AppConfig;
  dbClient: DbClient;
  queueClient?: QueueClient;
  swaggerClient: SwaggerClient;
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
  const swaggerClient =
    args.swaggerClient || (await createSwaggerClient(appConfig));

  return {
    appConfig,
    dbClient,
    queueClient,
    swaggerClient,
    // cognitoClient,
  };
};

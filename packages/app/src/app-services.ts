import { DbClient, createDbClient } from '@app/libs/db';
import { createDbPool } from '@app/libs/db/setup';
import { QueueClient, createQueueClient } from '@app/libs/queue';
import { AppConfig, getAppConfig } from '@app/libs/utils/config';

import logger from '@lib/utils/logger';

import { QueueEmitter, buildEmiter } from './libs/queue/emitter';
import { SwaggerClient, createSwaggerClient } from './libs/swagger';

export type AppServices = {
  appConfig: AppConfig;
  dbClient: DbClient;
  queueEmitter: QueueEmitter;
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
  const queueEmitter = buildEmiter(
    await createQueueClient(appConfig.queueConfig),
  );
  const swaggerClient =
    args.swaggerClient || (await createSwaggerClient(appConfig));

  return {
    appConfig,
    dbClient,
    queueEmitter,
    swaggerClient,
    // cognitoClient,
  };
};

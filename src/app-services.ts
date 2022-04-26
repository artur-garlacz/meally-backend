import { createDbClient, DbClient } from '@libs/db';
import { createDbPool } from '@libs/db/setup';
import { AppConfig, getAppConfig } from '@libs/utils/config';
import logger from '@libs/utils/logger';

export type AppServices = {
  appConfig: AppConfig;
  dbClient: DbClient;
};

export const buildAppServices = async (
  args: Partial<AppServices> = {},
): Promise<AppServices> => {
  logger.info('Building app services');
  const appConfig = args.appConfig || (await getAppConfig());

  const dbClient =
    args.dbClient || (await createDbClient(await createDbPool(appConfig)));

  return {
    appConfig,
    dbClient,
  };
};

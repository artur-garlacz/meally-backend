// import { QueueClient, createQueueClient } from '@libs/queue';
import { AppConfig, getAppConfig } from '@notify/utils/config';
import logger from '@lib/utils/logger';
import { createQueueClient, QueueClient } from './queue';
import { createMailClient, MailClient } from './mailer';
import { useChannels } from './express/channels';
import { createDbClient, DbClient } from './db';
import { createDbPool } from './db/setup';
import { createMailService, MailService } from './mailer/mail-service';

export type AppServices = {
  appConfig: AppConfig;
  dbClient: DbClient;
  queueClient: QueueClient;
  mailClient: MailClient;
  mailService: MailService;
};

export const buildAppServices = async (
  args: Partial<AppServices> = {},
): Promise<AppServices> => {
  logger.info('Building app services');
  const appConfig = args.appConfig || (await getAppConfig());

  //clients
  const dbClient =
    args.dbClient || (await createDbClient(await createDbPool(appConfig)));
  const queueClient = await createQueueClient(appConfig.queueConfig);
  const mailClient = await createMailClient(appConfig);

  // service
  const mailService = createMailService({ mailClient, dbClient });

  useChannels({ queueClient, mailService });

  return {
    appConfig,
    dbClient,
    queueClient,
    mailClient,
    mailService,
  };
};

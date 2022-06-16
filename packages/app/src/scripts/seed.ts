import { createDbPool } from '@app/libs/db/setup';
import { runSeed } from '@app/libs/migrations/run-seed';
import { getAppConfig } from '@app/libs/utils/config';

import logger from '@lib/utils/logger';

run()
  .then(() => logger.info('Seed completed'))
  .catch((err) => {
    logger.error('Failed to run seed', err);
    process.exit(1);
  });

async function run() {
  const config = await getAppConfig();
  const dbPool = await createDbPool(config);
  return runSeed(dbPool);
}

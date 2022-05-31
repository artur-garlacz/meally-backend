import { createDbPool } from '@libs/db/setup';
import { runSeed } from '@libs/migrations/run-seed';
import { getAppConfig } from '@libs/utils/config';
import logger from '@libs/utils/logger';

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

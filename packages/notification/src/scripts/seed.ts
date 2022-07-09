import logger from '@lib/utils/logger';
import { runSeed } from '@notify/implementation/db/migrations/run-seed';
import { createDbPool } from '@notify/implementation/db/setup';
import { getAppConfig } from '@notify/utils/config';

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

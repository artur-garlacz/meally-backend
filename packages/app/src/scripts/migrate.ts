import { createDbPool } from '@app/libs/db/setup';
import { runMigrations } from '@app/libs/migrations/run-migrations';
import { runSeed } from '@app/libs/migrations/run-seed';
import { getAppConfig } from '@app/libs/utils/config';

import logger from '@lib/utils/logger';

run()
  .then(() => {
    logger.info('Migrations completed');
    process.exit(0);
  })
  .catch((err) => {
    logger.error('Failed to run migrations', err);
    process.exit(1);
  });

async function run() {
  const force = process.argv.includes('--force');
  const seed = process.argv.includes('--seed');

  const config = await getAppConfig();
  const dbPool = await createDbPool(config);
  await runMigrations({ force, db: dbPool });
  if (seed) {
    await runSeed(dbPool);
  }
}

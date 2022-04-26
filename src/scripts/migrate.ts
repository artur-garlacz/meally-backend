import logger from '@libs/utils/logger';
import { getAppConfig } from '@libs/utils/config';
import { runSeed } from '@libs/migrations/run-seed';
import { runMigrations } from '@libs/migrations/run-migrations';
import { createDbPool } from '@libs/db/setup';

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

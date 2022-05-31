import { createDbPool } from '@libs/db/setup';
import { runMigrations } from '@libs/migrations/run-migrations';
import { runSeed } from '@libs/migrations/run-seed';
import { getAppConfig } from '@libs/utils/config';
import logger from '@libs/utils/logger';

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
  console.log(dbPool, 'dbPool');
  await runMigrations({ force, db: dbPool });
  if (seed) {
    await runSeed(dbPool);
  }
}

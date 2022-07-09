import logger from '@lib/utils/logger';
import { runMigrations } from '@notify/implementation/db/migrations/run-migrations';
import { runSeed } from '@notify/implementation/db/migrations/run-seed';
import { createDbPool } from '@notify/implementation/db/setup';
import { getAppConfig } from '@notify/utils/config';

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

import Reporter from 'mocha-dd-reporter';
import { createDbClient, DbClient } from '@libs/db';
import { createDbPool } from '@libs/db/setup';
import { runMigrations } from '@libs/migrations/run-migrations';
import { DbConfig } from '@libs/utils/config';
import { createEnvReader, Environment } from '@libs/utils/env';
import { transformToClass } from '@libs/utils/validation';
import { DatabasePool, sql } from 'slonik';

let testDbClient: DbClient;

beforeEach('Clean up after test', async () => {
  if (testDbClient) {
    const dbClient = await getTestDbClient();
    await dbClient.adhoc(async (db) => {
      await db.query(sql`
        DELETE FROM "user";
        DELETE FROM "userDetails";
        DELETE FROM "offer";
        DELETE FROM "offerDetails";
        DELETE FROM "offerCategory";
        DELETE FROM "userSchedule";
        DELETE FROM "schedule";
      `);
    });
  }
});

export async function getTestDbClient(spec?: {
  forceRecreate?: boolean;
}): Promise<DbClient> {
  if (!testDbClient || spec?.forceRecreate === true) {
    const pool = await Reporter.withSkipTestLogCaptureAsync(async () => {
      const testDbPool = await setupTestDbPool();
      await runMigrations({ force: true, db: testDbPool });
      return testDbPool;
    }, 'migrations');

    testDbClient = createDbClient(pool);
  }

  return testDbClient;
}

export async function setupTestDbPool(): Promise<DatabasePool> {
  return createDbPool({
    environment: Environment.local,
    dbConfig: await readTestDbClientConfig(),
  });
}

export function readTestDbClientConfig(): Promise<DbConfig> {
  const { readOptionalString } = createEnvReader(process.env);

  const host = readOptionalString('POSTGRES_HOST', 'localhost');
  const port = readOptionalString('POSTGRES_PORT', '5432');
  const database = readOptionalString('POSTGRES_DB', 'meally_tests');
  const user = readOptionalString('POSTGRES_USER', 'postgres');
  const password = readOptionalString('POSTGRES_PASSWORD', '');
  const databaseUrl = `postgresql://${user}:${password}@${host}:${port}/${database}`;

  return transformToClass(DbConfig, {
    host,
    port,
    database,
    user,
    password,
    databaseUrl,
  });
}

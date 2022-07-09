import { CommonQueryMethods, DatabasePool, sql } from 'slonik';

import migrations from './sources';

import logger from '@lib/utils/logger';

type Migration = {
  migrationId: string;
  run(db: CommonQueryMethods): Promise<void>;
};

export async function runMigrations({
  force,
  db,
}: {
  force: boolean;
  db: DatabasePool;
}) {
  const pendingMigrations = await getPendingMigrations(db, force);

  if (pendingMigrations.length === 0) {
    logger.info('Migrations up to date');
    return;
  }

  logger.info(`Found ${pendingMigrations.length} pending migrations`, {
    pendingMigrationsCount: pendingMigrations.length,
    pendingMigrations: pendingMigrations.map((m) => m.migrationId),
  });

  await db.transaction(async (transaction) => {
    for (const { migrationId, run } of pendingMigrations) {
      logger.info(`Running migration ${migrationId}`, { migrationId });

      try {
        await run(transaction);
        await saveMigration(transaction, migrationId);
      } catch (err) {
        logger.error(`Migration ${migrationId} failed`, {
          migrationId,
          err,
        });

        throw err;
      }
    }
  });
}

async function getPendingMigrations(
  db: CommonQueryMethods,
  isForce = false,
): Promise<Migration[]> {
  if (isForce) {
    logger.warn('Force running all migrations');
    return migrations;
  }

  const migrationsTableFound = await checkMigrationsTableExists(db);

  if (!migrationsTableFound) {
    logger.warn('No migrations table found, running all migrations');
    return migrations;
  }

  const latestMigrationId = await getLatestMigrationId(db);

  if (!latestMigrationId) {
    logger.info('Empty migrations table, running all migrations');
    return migrations;
  }

  logger.info(`Latest migration is ${latestMigrationId}`, {
    latestMigrationId,
  });

  return migrations.filter(
    ({ migrationId }) =>
      getMigrationNumber(migrationId) > getMigrationNumber(latestMigrationId),
  );
}

function checkMigrationsTableExists(db: CommonQueryMethods): Promise<boolean> {
  logger.debug('Checking existence of migrations table');
  return db
    .one(
      sql`
        SELECT EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = 'migrations'
        );`,
    )
    .then((data) => Boolean(data.exists));
}

async function getLatestMigrationId(
  db: CommonQueryMethods,
): Promise<string | null> {
  logger.debug('Reading the latest migration from database');
  return db
    .one(
      sql`SELECT MAX("migrationId") AS "latestMigrationId" FROM "migrations"`,
    )
    .then((data) =>
      data.latestMigrationId ? String(data.latestMigrationId) : null,
    );
}

function getMigrationNumber(migrationId: string): number {
  const prefix = migrationId.match(/^((\d){4})-/);

  if (prefix && prefix[1]) {
    return Number.parseInt(prefix[1]);
  }

  throw new Error(`Cannot parse migration id ${migrationId}`);
}

async function saveMigration(
  db: CommonQueryMethods,
  migrationId: string,
): Promise<void> {
  logger.debug('Saving migration', { migrationId });

  await db.query(
    sql`INSERT INTO "migrations" ("migrationId") VALUES (${migrationId});`,
  );
}

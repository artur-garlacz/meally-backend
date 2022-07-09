import { sql } from 'slonik';

import { Migration } from '.';

const migration: Migration = {
  async run(db) {
    await db.query(sql`
          DROP TABLE IF EXISTS "email" CASCADE;
      `);

    await db.query(sql`
        DROP TABLE IF EXISTS "migrations";
        CREATE TABLE "migrations" (
          "migrationId" text PRIMARY KEY CHECK (LENGTH("migrationId") > 0),
          "migratedAt" timestamp NOT NULL DEFAULT NOW()
        );`);
  },
};

export default migration;

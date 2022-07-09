import { sql } from 'slonik';

import { Migration } from '.';

const migration: Migration = {
  async run(db) {
    await db.query(sql`
          DROP TABLE IF EXISTS "user" CASCADE;
          DROP TABLE IF EXISTS "refreshToken" CASCADE;
          DROP TABLE IF EXISTS "userDetails" CASCADE;
          DROP TABLE IF EXISTS "offer" CASCADE;
          DROP TABLE IF EXISTS "offerOrder" CASCADE;
          DROP TYPE IF EXISTS "offerOrderStatus" CASCADE;
          DROP TABLE IF EXISTS "offerDetails" CASCADE;
          DROP TYPE IF EXISTS "offerStatus" CASCADE;
          DROP TABLE IF EXISTS "offerCategory" CASCADE;
          DROP TYPE IF EXISTS "dayName" CASCADE;
          DROP TABLE IF EXISTS "userSchedule" CASCADE;
          DROP TABLE IF EXISTS "schedule" CASCADE;
          DROP TABLE IF EXISTS "userPassword" CASCADE;
          DROP TABLE IF EXISTS "userReview" CASCADE;
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

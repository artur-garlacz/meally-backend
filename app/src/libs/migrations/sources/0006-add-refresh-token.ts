import { sql } from 'slonik';

import { Migration } from '.';

const migration: Migration = {
  async run(db) {
    await db.query(sql`
            CREATE TABLE "refreshToken" (
                "refreshTokenId" uuid PRIMARY KEY CHECK (
                    "refreshTokenId" <> '00000000-0000-0000-0000-000000000000'
                ),
                "refreshToken"      text    NOT NULL,
                "createdAt"         timestamp   NOT NULL,
                "updatedAt"         timestamp   NOT NULL,
                "userId"            uuid NOT NULL UNIQUE REFERENCES "user" ("userId") ON DELETE CASCADE
            );
      `);
  },
};

export default migration;

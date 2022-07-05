import { sql } from 'slonik';

import { Migration } from '.';

const migration: Migration = {
  async run(db) {
    await db.query(sql`
        CREATE TABLE "email" (
          "emailId" uuid PRIMARY KEY CHECK (
            "emailId" <> '00000000-0000-0000-0000-000000000000'
          ),
          "sendTo"      text        NOT NULL,
          "createdAt"   timestamp   NULL DEFAULT NOW(),
          "sentAt"      timestamp   NULL,
          "erroredAt"   timestamp   NULL
        );
    `);
  },
};

export default migration;

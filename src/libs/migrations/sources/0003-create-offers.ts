import { sql } from 'slonik';
import { Migration } from '.';

const migration: Migration = {
  async run(db) {
    await db.query(sql`
        CREATE TABLE "offerCategory"(
            "offerCategoryId" uuid PRIMARY KEY CHECK (
                "offerCategoryId" <> '00000000-0000-0000-0000-000000000000'
            ),
            "shortDesc"   varchar(300)    NOT NULL,
            "name"        varchar(150)    NOT NULL,
        );

        CREATE TABLE "offer" (
          "offerId" uuid PRIMARY KEY CHECK (
            "offerId" <> '00000000-0000-0000-0000-000000000000'
          ),
          "price"               decimal(2,2)    NOT NULL,
          "longDesc"            text            NOT NULL,
          "shortDesc"           varchar(300)    NOT NULL,
          "availableQuantity"   int             NOT NULL,
          "createdAt"           timestamp       NOT NULL DEFAULT NOW(),
          "updatedAt"           timestamp       NOT NULL DEFAULT NOW(),
          "userId"              uuid NULL REFERENCES "user" ("userId"),
          "offerCategoryId"     uuid NULL REFERENCES "offerCategory" ("offerCategoryId"),
        );
    `);
  },
};

export default migration;

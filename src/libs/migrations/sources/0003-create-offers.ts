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

        CREATE TYPE "offerStatus" AS ENUM ('draft', 'published', 'archived');

        CREATE TABLE "offer" (
          "offerId" uuid PRIMARY KEY CHECK (
            "offerId" <> '00000000-0000-0000-0000-000000000000'
          ),
          "title"               varchar(200)    NOT NULL,
          "unitPrice"           decimal(2,2)    NOT NULL,
          "longDesc"            text            NOT NULL,
          "shortDesc"           varchar(300)    NOT NULL,
          "status"              offerStatus     NOT NULL,
          "availableQuantity"   int             NOT NULL,
          "promoted"            boolean         NULL,
          "createdAt"           timestamp       NOT NULL DEFAULT NOW(),
          "updatedAt"           timestamp       NOT NULL DEFAULT NOW(),
          "userId"              uuid NULL REFERENCES "user" ("userId"),
          "offerCategoryId"     uuid NULL REFERENCES "offerCategory" ("offerCategoryId"),
        );

        CREATE TABLE "offerDetails" (
          "offerDetailsId" uuid PRIMARY KEY CHECK (
            "offerDetailsId" <> '00000000-0000-0000-0000-000000000000'
          ),
          "address"       varchar(60) NOT NULL,
          "city"          varchar(50) NOT NULL,
          "postalCode"    varchar(10) NOT NULL,
          "country"       varchar(40) NOT NULL,
          "offerId"       uuid NULL REFERENCES "offer" ("offerId")
        );
    `);
  },
};

export default migration;

// workingDays
// CREATE TABLE "days" (
//   "offerAvailableDaysId" uuid PRIMARY KEY CHECK (
//     "offerAvailableDaysId" <> '00000000-0000-0000-0000-000000000000'
//   ),
//   "mon"      varchar(60) NOT NULL,
//   "tue"          varchar(50) NOT NULL,
//   "wen"    varchar(10) NOT NULL,
//   "country"       varchar(40) NOT NULL,
//   "offerId"       uuid NULL REFERENCES "offer" ("offerId"),
// );

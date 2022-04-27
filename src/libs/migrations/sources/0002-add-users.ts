import { sql } from 'slonik';
import { Migration } from '.';

const migration: Migration = {
  async run(db) {
    await db.query(sql`
        CREATE TABLE "user" (
          "userId" uuid PRIMARY KEY CHECK (
            "userId" <> '00000000-0000-0000-0000-000000000000'
          ),
          "email"       text        NOT NULL,
          "password"    varchar(30) NOT NULL,
          "createdAt"   timestamp   NOT NULL DEFAULT NOW(),
          "updatedAt"   timestamp   NOT NULL DEFAULT NOW()
        );
        
        CREATE TABLE "userDetails"(
            "userDetailsId" uuid PRIMARY KEY CHECK (
                "userDetailsId" <> '00000000-0000-0000-0000-000000000000'
            ),
            "address1"      varchar(60) NOT NULL,
            "address2"      varchar(60),
            "city"          varchar(50) NOT NULL,
            "postalCode"    varchar(10) NOT NULL,
            "country"       varchar(40) NOT NULL,
            "phoneNumber"   varchar(20) NOT NULL,
            "userId"        uuid NULL REFERENCES "user" ("userId")
        );
    `);
  },
};

export default migration;

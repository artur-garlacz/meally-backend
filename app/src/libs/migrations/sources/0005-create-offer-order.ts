import { sql } from 'slonik';

import { Migration } from '.';

const migration: Migration = {
  async run(db) {
    await db.query(sql`
            CREATE TYPE "offerOrderStatus" AS ENUM ('created', 'accepted', 'prepared', 'delivered', 'rejected');

            CREATE TABLE "offerOrder" (
                "offerOrderId" uuid PRIMARY KEY CHECK (
                    "offerOrderId" <> '00000000-0000-0000-0000-000000000000'
                ),
                "quantity"              int NOT NULL,
                "status"                "offerOrderStatus" NOT NULL DEFAULT 'created',
                "createdAt"             timestamp   NOT NULL,
                "updatedAt"             timestamp   NOT NULL,
                "offerId"               uuid NOT NULL REFERENCES "offer" ("offerId") ON DELETE CASCADE,
                "customerId"            uuid NOT NULL REFERENCES "user" ("userId") ON DELETE CASCADE
            );

            CREATE TABLE "userPassword" (
              "userPasswordId" uuid PRIMARY KEY CHECK (
                  "userPasswordId" <> '00000000-0000-0000-0000-000000000000'
              ),
              "createdAt"             timestamp  NOT NULL,
              "updatedAt"             timestamp  NOT NULL,
              "userId"                uuid NOT NULL REFERENCES "user" ("userId") ON DELETE CASCADE
            );

            CREATE TABLE "userReview" (
              "userReviewId" uuid PRIMARY KEY CHECK (
                  "userReviewId" <> '00000000-0000-0000-0000-000000000000'
              ),
              "message"           text        NOT NULL,
              "rate"              int         NOT NULL CHECK("rate" < 6 AND "rate" > 0),
              "createdAt"         timestamp   NOT NULL,
              "updatedAt"         timestamp   NOT NULL,
              "customerId"        uuid NOT NULL REFERENCES "user" ("userId") ON DELETE CASCADE,
              "userId"            uuid NOT NULL REFERENCES "user" ("userId") ON DELETE CASCADE
            );
      `);
  },
};

// userPasswords

// review

// payments

// discounts

// reports

export default migration;

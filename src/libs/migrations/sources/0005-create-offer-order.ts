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
                "createdAt"             datetime NOT NULL,
                "updatedAt"             datetime NOT NULL,
                "quantity"              int NOT NULL,
                "status"                "offerOrderStatus" NOT NULL DEFAULT 'created',
                "offerId"               uuid NOT NULL REFERENCES "offer" ("offerId") ON DELETE CASCADE
                "customerId"            uuid NOT NULL REFERENCES "user" ("customerId") ON DELETE CASCADE
            );

            CREATE TABLE "userPassword" (
              "userPasswordId" uuid PRIMARY KEY CHECK (
                  "userPasswordId" <> '00000000-0000-0000-0000-000000000000'
              ),
              "createdAt"             datetime NOT NULL,
              "updatedAt"             datetime NOT NULL,
              "userId"            uuid NOT NULL REFERENCES "user" ("userId") ON DELETE CASCADE
            )

            CREATE TABLE "userReview" (
              "userReviewId" uuid PRIMARY KEY CHECK (
                  "userReviewId" <> '00000000-0000-0000-0000-000000000000'
              ),
              "message"           text    NOT NULL,
              "rate"              int     NOT NULL CHECK "rate" < 6 AND "rate" > 0,
              "createdAt"         datetime NOT NULL,
              "updatedAt"         datetime NOT NULL,
              "customerId"            uuid NOT NULL REFERENCES "user" ("customerId") ON DELETE CASCADE
              "userId"            uuid NOT NULL REFERENCES "user" ("userId") ON DELETE CASCADE
            )
      `);
  },
};

// userPasswords

// review

// payments

// discounts

// reports

export default migration;

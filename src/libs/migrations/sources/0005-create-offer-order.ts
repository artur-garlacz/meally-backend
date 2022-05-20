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
      `);
  },
};

export default migration;

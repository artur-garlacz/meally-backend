import logger from '@libs/utils/logger';
import {
  chainOptional,
  toMany,
  toOptional,
  toRequired,
} from '@libs/utils/query';
import { serializeDate } from '@libs/utils/serialization';
import { CommonQueryMethods, sql } from 'slonik';
import { OrderEntity } from './entities';

export function ordersQueries(db: CommonQueryMethods) {
  return Object.freeze({
    createOrder(order: OrderEntity): Promise<OrderEntity> {
      logger.debug('DbClient.createOrder');

      return db.one(sql`
              INSERT INTO "offerOrder" (
                  "offerOrderId",
                  "status",
                  "quantity",
                  "createdAt",
                  "updatedAt",
                  "offerId",
                  "customerId") 
              VALUES (${order.offerOrderId},
                      ${order.status},
                      ${order.quantity},
                      ${order.status},
                      ${serializeDate(order.createdAt)},
                      ${serializeDate(order.updatedAt)},
                      ${order.offerId},
                      ${order.customerId}
              ) RETURNING *
            `);
    },
    getCustomerOrders<T extends { customerId: OrderEntity['customerId'] }>(
      args: T,
    ): Promise<OrderEntity[]> {
      return db
        .query(
          sql`
              SELECT * FROM "offerOrder" WHERE ${chainOptional(
                { customerId: args.customerId },
                'select',
              )}
                ORDER BY "offerOrderId"
            `,
        )
        .then(toMany(OrderEntity));
    },
    getMerchantOrders<T extends { userId: OrderEntity['customerId'] }>(
      args: T,
    ): Promise<OrderEntity[]> {
      return db
        .query(
          sql`
              SELECT * FROM "offerOrder" as "order" INNER JOIN "offer" on "order"."offerId" = "offer"."offerId"
              WHERE "offer"."offerId"=${args.userId} ORDER BY "order"."offerOrderId";
            `,
        )
        .then(toMany(OrderEntity));
    },
  });
}

import { Orders } from '@commons/api';
import {
  PaginationResponse,
  setPaginationParams,
  setPaginationResponse,
} from '@commons/pagination';
import { CommonQueryMethods, sql } from 'slonik';

import logger from '@libs/utils/logger';
import { chainOptional, toMany, toOptional } from '@libs/utils/query';
import { serializeDate } from '@libs/utils/serialization';

import { OrderEntity } from './entities';

export function ordersQueries(db: CommonQueryMethods) {
  return Object.freeze({
    createOrder(order: OrderEntity): Promise<OrderEntity> {
      logger.debug('DbClient.createOrder');

      return db.one(sql`
              INSERT INTO "offerOrder" (
                  "offerOrderId",
                  "quantity",
                  "status",
                  "createdAt",
                  "updatedAt",
                  "offerId",
                  "customerId") 
              VALUES (${order.offerOrderId},
                      ${order.quantity},
                      ${order.status},
                      ${serializeDate(order.createdAt)},
                      ${serializeDate(order.updatedAt)},
                      ${order.offerId},
                      ${order.customerId}
              ) RETURNING *
            `);
    },
    getOrderById<T extends { offerOrderId: OrderEntity['offerOrderId'] }>(
      args: T,
    ): Promise<OrderEntity | null> {
      return db
        .maybeOne(
          sql`
              SELECT * FROM "offerOrder" WHERE ${chainOptional(
                { offerOrderId: args.offerOrderId },
                'select',
              )}
                ORDER BY "offerOrderId"
            `,
        )
        .then(toOptional(OrderEntity));
    },
    async getPaginatedCustomerOrders(
      args: Orders.GetCustomerOrdersRequestQuery & {
        customerId: OrderEntity['customerId'];
      },
    ): Promise<PaginationResponse<OrderEntity>> {
      const { paginateCondition, whereCondition, perPage, page } =
        setPaginationParams<Orders.GetCustomerOrdersRequestQuery>(args);

      const items = await db
        .query(
          sql`
              SELECT * FROM "offerOrder" WHERE ${whereCondition}
                ORDER BY "offerOrderId" ${paginateCondition}
            `,
        )
        .then(toMany(OrderEntity));

      return setPaginationResponse<OrderEntity>({
        items,
        perPage,
        page,
      });
    },
    getPaginatedMerchantOrders<T extends { userId: OrderEntity['customerId'] }>(
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
    // getOrdersCount(): number {
    //   return db.query(
    //     sql`
    //           SELECT COUNT("order".) FROM "offerOrder" as "order" INNER JOIN "offer" on "order"."offerId" = "offer"."offerId"
    //           WHERE "offer"."offerId"=${args.userId} ORDER BY "order"."offerOrderId";
    //         `,
    //   );
    // },
  });
}

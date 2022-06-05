import { Orders } from '@commons/api';
import {
  setPaginationParams,
  setPaginationResponse,
} from '@commons/pagination';
import { CommonQueryMethods, sql } from 'slonik';

import logger from '@libs/utils/logger';
import {
  chainOptional,
  toMany,
  toOptional,
  toRequired,
} from '@libs/utils/query';
import { serializeDate } from '@libs/utils/serialization';

import { OfferEntity } from '@modules/offers/entities';

import { OrderEntity } from './entities';

export function ordersQueries(db: CommonQueryMethods) {
  return Object.freeze({
    createOrder(order: OrderEntity): Promise<OrderEntity> {
      logger.info('[Command] DbClient.createOrder');

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
      logger.info('[Command] DbClient.getOrderById');

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
    updateOrderStatus(args: {
      status: OrderEntity['status'];
      orderId: OrderEntity['offerOrderId'];
    }): Promise<OrderEntity> {
      logger.info('[Command] DbClient.getOrderById');

      return db
        .query(
          sql`
          UPDATE "offer"
          SET "status"=${args.status}
          WHERE "offerOrderId"=${args.orderId}
          RETURNING *
            `,
        )
        .then(toRequired(OrderEntity));
    },
    async getPaginatedCustomerOrders(
      args: Orders.GetCustomerOrdersRequestQuery & {
        customerId: OrderEntity['customerId'];
      },
    ): Promise<Orders.GetOrdersResponse> {
      logger.info('[Command] DbClient.getPaginatedCustomerOrders');

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
    async getPaginatedMerchantOrders({
      userId,
      ...args
    }: Orders.GetMerchantOrdersRequestQuery &
      Pick<OfferEntity, 'userId'>): Promise<Orders.GetOrdersResponse> {
      logger.info('[Command] DbClient.getPaginatedMerchantOrders');

      const { paginateCondition, page, perPage } =
        setPaginationParams<Orders.GetMerchantOrdersRequestQuery>(args);

      const items = await db
        .query(
          sql`
              SELECT * FROM "offerOrder" JOIN "offer" on "offerOrder"."offerId"="offer"."offerId"
              WHERE "offer"."offerId"=${userId} ORDER BY "offerOrder"."offerOrderId" ${paginateCondition};
            `,
        )
        .then(toMany(OrderEntity));

      return setPaginationResponse<OrderEntity>({
        items,
        perPage,
        page,
      });
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

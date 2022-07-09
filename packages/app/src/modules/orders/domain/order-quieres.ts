import {
  setPaginationParams,
  setPaginationResponse,
} from '@app/commons/pagination';
import { CommonQueryMethods, sql } from 'slonik';

import {
  chainOptional,
  toMany,
  toOptional,
  toRequired,
} from '@app/libs/utils/query';

import logger from '@lib/utils/logger';
import { serializeDate } from '@lib/utils/serialization';

import { OfferEntity } from '@app/modules/offers/domain/entities';

import {
  GetCustomerOrdersRequestQuery,
  GetMerchantOrdersRequestQuery,
  GetOrdersResponse,
} from '../api/get-orders';
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

      return db.one(
        sql`
          UPDATE "offerOrder"
          SET "status"=${args.status}
          WHERE "offerOrderId"=${args.orderId}
          RETURNING *
            `,
      );
    },
    async getPaginatedCustomerOrders(
      args: GetCustomerOrdersRequestQuery & {
        customerId: OrderEntity['customerId'];
      },
    ): Promise<GetOrdersResponse> {
      logger.info('[Command] DbClient.getPaginatedCustomerOrders');

      const { paginateCondition, whereCondition, perPage, page } =
        setPaginationParams<GetCustomerOrdersRequestQuery>(args);

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
    }: GetMerchantOrdersRequestQuery &
      Pick<OfferEntity, 'userId'>): Promise<GetOrdersResponse> {
      logger.info('[Command] DbClient.getPaginatedMerchantOrders');

      const { paginateCondition, page, perPage } =
        setPaginationParams<GetMerchantOrdersRequestQuery>(args);

      const items = await db
        .query(
          sql`
              SELECT * FROM "offerOrder" JOIN "offer" on "offerOrder"."offerId"="offer"."offerId"
              WHERE "offer"."userId"=${userId} ORDER BY "offerOrder"."offerOrderId" ${paginateCondition};
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

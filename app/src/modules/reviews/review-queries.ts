import {
  setPaginationParams,
  setPaginationResponse,
} from '@commons/pagination';
import { CommonQueryMethods, sql } from 'slonik';

import logger from '@libs/utils/logger';
import { serializeDate } from '@libs/utils/serialization';

import { UserReviewEntity } from './entities';

export function ordersQueries(db: CommonQueryMethods) {
  return Object.freeze({
    createUserReview(review: UserReviewEntity): Promise<UserReviewEntity> {
      logger.info('[Command] DbClient.createUserReview');

      return db.one(sql`
              INSERT INTO "userReview" (
                  "userReviewId",
                  "message",
                  "rate",
                  "createdAt",
                  "updatedAt",
                  "customerId",
                  "userId") 
              VALUES (${review.userReviewId},
                      ${review.message},
                      ${review.rate},
                      ${serializeDate(review.createdAt)},
                      ${serializeDate(review.updatedAt)},
                      ${review.customerId},
                      ${review.userId}
              ) RETURNING *
            `);
    },
  });
}

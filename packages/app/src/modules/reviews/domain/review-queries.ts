import { Reviews } from '@commons/domain';
import {
  setPaginationParams,
  setPaginationResponse,
} from '@commons/pagination';
import { CommonQueryMethods, sql } from 'slonik';

import logger from '@libs/utils/logger';
import { toMany } from '@libs/utils/query';
import { serializeDate } from '@libs/utils/serialization';

import { UserReviewEntity } from './entities';

export function reviewsQueries(db: CommonQueryMethods) {
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
    async getPaginatedUserReviews(
      args: Reviews.GetUserReviewsRequestQuery,
    ): Promise<Reviews.GetUserReviewsResponse> {
      logger.info('[Command] DbClient.getPaginatedUserReviews');

      const { paginateCondition, whereCondition, perPage, page } =
        setPaginationParams<Reviews.GetUserReviewsRequestQuery>(args);

      const items = await db
        .query(
          sql`
              SELECT * FROM "userReview" WHERE ${whereCondition}
                ORDER BY userReviewId" ${paginateCondition};
            `,
        )
        .then(toMany(UserReviewEntity));

      return setPaginationResponse<UserReviewEntity>({
        items,
        perPage,
        page,
      });
    },
  });
}

import { GetItemsRequestQuery, PaginationResponse } from '@commons/pagination';
import { z } from 'zod';

import { UserReviewEntity } from '@modules/reviews/domain/entities';

// GET Request
type UserReviewsQueryString = Pick<UserReviewEntity, 'userId'> &
  Partial<Pick<UserReviewEntity, 'rate' | 'createdAt'>>;

export type GetUserReviewsRequestQuery =
  GetItemsRequestQuery<UserReviewsQueryString>;

// GET Response
export type GetUserReviewsResponse = PaginationResponse<UserReviewEntity>;

// POST Request body
export type CreateUserReviewRequestBody = z.infer<
  typeof createUserReviewSchema
>;

export const createUserReviewSchema = z.object({
  body: z.object({
    userReview: z.object({
      rate: z
        .number({ required_error: 'Rate is required' })
        .min(1, 'Min value is 1')
        .max(5, 'Max value is 5'),
      message: z.string({ required_error: 'Message is required' }),
    }),
  }),
});

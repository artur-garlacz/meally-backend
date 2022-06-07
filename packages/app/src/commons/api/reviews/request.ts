import { GetItemsRequestQuery } from '@commons/pagination';

import { UserReviewEntity } from '@modules/reviews/entities';

type UserReviewsQueryString = Pick<UserReviewEntity, 'userId'> &
  Partial<Pick<UserReviewEntity, 'rate' | 'createdAt'>>;

export type GetUserReviewsRequestQuery =
  GetItemsRequestQuery<UserReviewsQueryString>;

import { PaginationResponse } from '@commons/pagination';

import { UserReviewEntity } from '@modules/reviews/entities';

export type GetUserReviewsResponse = PaginationResponse<UserReviewEntity>;

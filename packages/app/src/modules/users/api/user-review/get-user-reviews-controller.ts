import { AppServices } from '@app/app-services';
import { Request, Response } from 'express';

import {
  GetUserReviewsRequestQuery,
  GetUserReviewsResponse,
} from './user-review-dtos';

export const getUserReviewsController = (app: AppServices) => {
  return async (
    req: Request<
      { userId?: string },
      GetUserReviewsResponse,
      {},
      GetUserReviewsRequestQuery
    >,
    res: Response<GetUserReviewsResponse>,
  ) => {
    const { page, perPage } = req.query;

    const response = await app.dbClient.getPaginatedUserReviews({
      perPage,
      page,
      userId: req.params.userId!,
    });

    return res.status(200).send(response);
  };
};

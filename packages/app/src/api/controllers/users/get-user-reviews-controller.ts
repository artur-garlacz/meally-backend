import { AppServices } from '@app-services';
import { Reviews } from '@commons/api';
import { Request, Response } from 'express';

export const getUserReviewsController = (app: AppServices) => {
  return async (
    req: Request<
      { userId?: string },
      Reviews.GetUserReviewsResponse,
      {},
      Reviews.GetUserReviewsRequestQuery
    >,
    res: Response<Reviews.GetUserReviewsResponse>,
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

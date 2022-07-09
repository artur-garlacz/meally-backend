import { AppServices } from '@app/app-services';
import { AuthRequest } from '@app/commons/request';
import { Request, Response } from 'express';

import { GetOffersRequestQuery, GetOffersResponse } from './get-offer-dtos';

export const getMyOffersController = (app: AppServices) => {
  return async (
    req: AuthRequest<{}, GetOffersResponse, {}, GetOffersRequestQuery>,
    res: Response<GetOffersResponse>,
  ) => {
    const {
      sender: { userId },
      query: { page, perPage, offerCategoryId },
    } = req;

    const response = await app.dbClient.getPaginatedOffers({
      offerCategoryId,
      userId,
      perPage,
      page,
    });

    return res.status(200).send(response);
  };
};

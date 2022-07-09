import { AppServices } from '@app/app-services';
import { Request, Response } from 'express';

import {
  GetOffersRequestQuery,
  GetOffersResponse,
  OfferStatus,
} from './get-offer-dtos';

export const getOffersController = (app: AppServices) => {
  return async (
    req: Request<{}, GetOffersResponse, {}, GetOffersRequestQuery>,
    res: Response<GetOffersResponse>,
  ) => {
    const { page, perPage, offerCategoryId } = req.query;

    const response = await app.dbClient.getPaginatedOffers({
      offerCategoryId,
      status: OfferStatus.published,
      perPage,
      page,
    });

    return res.status(200).send(response);
  };
};

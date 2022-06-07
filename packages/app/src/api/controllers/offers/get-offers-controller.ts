import { AppServices } from '@app-services';
import { Offers } from '@commons/api';
import { Request, Response } from 'express';

export const getOffersController = (app: AppServices) => {
  return async (
    req: Request<
      {},
      Offers.GetOffersResponse,
      {},
      Offers.GetOffersRequestQuery
    >,
    res: Response<Offers.GetOffersResponse>,
  ) => {
    const { page, perPage, offerCategoryId } = req.query;

    const response = await app.dbClient.getPaginatedOffers({
      offerCategoryId,
      status: Offers.OfferStatus.published,
      perPage,
      page,
    });

    return res.status(200).send(response);
  };
};

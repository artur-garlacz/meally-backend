import { AppServices } from '@app-services';
import { Offers } from '@commons/api';
import { setPaginationResponse } from '@commons/pagination';
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
    const { page, perPage, offerCategoryId } = getQueryParams(req.query);

    const offers = await app.dbClient.getPaginatedOffers({
      offerCategoryId,
      status: Offers.OfferStatus.published,
      perPage,
      page,
    });

    const response: Offers.GetOffersResponse = setPaginationResponse({
      items: offers,
      perPage,
      page,
    });
    return res.status(200).send(response);
  };
};

function getQueryParams(args: Offers.GetOffersRequestQuery) {
  return {
    ...args,
    page: Number(args.page ?? 1),
    perPage: Number(args.perPage ?? 10),
  };
}

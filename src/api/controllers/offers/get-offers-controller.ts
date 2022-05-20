import { Request, Response } from 'express';
import { AppServices } from '@app-services';
import { setPaginationResponse } from '@commons/pagination';
import {
  GetOffersRequestQuery,
  GetOffersResponse,
  OfferStatus,
} from '@commons/api/offers';

export const getOffersController = (app: AppServices) => {
  return async (
    req: Request<{}, GetOffersResponse, {}, GetOffersRequestQuery>,
    res: Response<GetOffersResponse>,
  ) => {
    const { page, perPage, offerCategoryId } = getQueryParams(req.query);

    const offers = await app.dbClient.getOffers({
      offerCategoryId,
      status: OfferStatus.published,
      perPage,
      page,
    });

    const response: GetOffersResponse = setPaginationResponse({
      items: offers,
      perPage,
      page,
    });
    return res.status(200).send(response);
  };
};

function getQueryParams(args: GetOffersRequestQuery) {
  return {
    ...args,
    page: Number(args.page ?? 1),
    perPage: Number(args.perPage ?? 10),
  };
}

import { Request, Response } from 'express';
import { AppServices } from '@app-services';
import { setPaginationResponse } from '@commons/pagination';

export const getOffersController = (app: AppServices) => {
  return async (req: Request, res: Response) => {
    const offers = await app.dbClient.getAllOffers();

    return res.status(200).send(setPaginationResponse({ items: offers }));
  };
};

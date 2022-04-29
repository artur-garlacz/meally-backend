import { Request, Response } from 'express';
import { AppServices } from '@app-services';

export const getOffersController = (app: AppServices) => {
  return async (req: Request, res: Response) => {
    const offers = await app.dbClient.getAllOffers();

    return res.status(200).send({ data: offers, dataCount: offers.length });
  };
};

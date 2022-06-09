import { AppServices } from '@app-services';
import { Offers } from '@commons/domain';
import { Request, Response } from 'express';

export const getOfferCategoriesController = (app: AppServices) => {
  return async (
    req: Request,
    res: Response<Offers.GetOfferCategoriesResponse>,
  ) => {
    const offerCategories = await app.dbClient.getAllOfferCategories();
    return res.status(200).send({
      data: offerCategories,
    });
  };
};

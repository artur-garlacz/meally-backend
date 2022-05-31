import { AppServices } from '@app-services';
import { GetOfferCategoriesResponse } from '@commons/api/offers';
import { Request, Response } from 'express';

export const getOfferCategoriesController = (app: AppServices) => {
  return async (req: Request, res: Response<GetOfferCategoriesResponse>) => {
    const offerCategories = await app.dbClient.getAllOfferCategories();
    return res.status(200).send({
      data: offerCategories,
    });
  };
};

import { AppServices } from '@app-services';
import { Request, Response } from 'express';

import { GetOfferCategoriesResponse } from './get-offer-dtos';

export const getOfferCategoriesController = (app: AppServices) => {
  return async (req: Request, res: Response<GetOfferCategoriesResponse>) => {
    const offerCategories = await app.dbClient.getAllOfferCategories();
    return res.status(200).send({
      data: offerCategories,
    });
  };
};

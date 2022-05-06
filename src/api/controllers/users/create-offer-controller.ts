import { Request, Response } from 'express';
import { AppServices } from '@app-services';

export const createOfferController = (app: AppServices) => {
  return async (req: Request, res: Response) => {
    // const offer = await app.dbClient.createOffer({});

    return res.status(200);
  };
};

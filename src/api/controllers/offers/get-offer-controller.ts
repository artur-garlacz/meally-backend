import { Request, Response } from 'express';
import { AppServices } from '@app-services';
import { GetOfferResponse } from '@commons/api/offers';

export const getOfferController = (app: AppServices) => {
  return async (
    req: Request<{ offerId?: string }, GetOfferResponse, {}, {}>,
    res: Response<GetOfferResponse>,
  ) => {
    const { offerId } = req.params;

    if (!offerId) {
      return res.status(404);
    }

    const offer = await app.dbClient.getOfferById(offerId);

    return res.status(200).send({ data: offer });
  };
};

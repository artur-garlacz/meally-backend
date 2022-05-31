import { AppServices } from '@app-services';
import { GetOfferResponse } from '@commons/api/offers';
import { ErrorType } from '@commons/errors';
import { Request, Response } from 'express';

import { HttpErrorResponse } from '@libs/utils/errors';

export const getOfferController = (app: AppServices) => {
  return async (
    req: Request<{ offerId?: string }, GetOfferResponse, {}, {}>,
    res: Response<GetOfferResponse>,
  ) => {
    const { offerId } = req.params;

    const offer = await app.dbClient.getOfferById(offerId!);

    if (offer) {
      return res.status(200).send({ data: offer });
    }

    throw new HttpErrorResponse(404, {
      message: 'Offer not found',
      kind: ErrorType.NotFound,
    });
  };
};

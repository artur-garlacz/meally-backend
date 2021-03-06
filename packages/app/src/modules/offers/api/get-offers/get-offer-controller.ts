import { AppServices } from '@app/app-services';
import { ErrorType } from '@app/commons/errors';
import { Request, Response } from 'express';

import { HttpErrorResponse } from '@app/libs/utils/errors';

import { GetOfferResponse } from './get-offer-dtos';

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

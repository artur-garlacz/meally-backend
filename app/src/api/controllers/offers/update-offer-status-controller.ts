import { AppServices } from '@app-services';
import { Offers } from '@commons/api';
import { ErrorType } from '@commons/errors';
import { AuthRequest } from '@commons/request';
import { Response } from 'express';
import { z } from 'zod';

import { HttpErrorResponse } from '@libs/utils/errors';

export const updateOfferStatusController = (app: AppServices) => {
  return async (
    req: AuthRequest<{ offerId?: string }, {}, UpdateOfferRequestBody['body']>,
    res: Response<Offers.GetOfferResponse>,
  ) => {
    const {
      sender: { userId },
      params: { offerId },
      body: { offer },
    } = req;

    const currOffer = await app.dbClient.getOfferById(offerId!);

    if (!currOffer) {
      throw new HttpErrorResponse(404, {
        message: 'Offer not found',
        kind: ErrorType.NotFound,
      });
    }

    const updatedOffer = await app.dbClient.updateOffer({
      offerId: offerId!,
      updateOffer: {
        status: verifyOfferStatus(currOffer?.status!, offer.status),
      },
      userId,
    });

    return res.status(200).send({
      data: updatedOffer,
    });
  };
};

type UpdateOfferRequestBody = z.infer<typeof updateOfferStatusSchema>;

export const updateOfferStatusSchema = z.object({
  body: z.object({
    offer: z.object({
      status: z.enum([
        Offers.OfferStatus.archived,
        Offers.OfferStatus.draft,
        Offers.OfferStatus.published,
      ]),
    }),
  }),
});

export function verifyOfferStatus(
  currStatus: Offers.OfferStatusType,
  newStatus: Offers.OfferStatusType,
) {
  if (currStatus === 'archived') {
    return newStatus === 'draft' ? newStatus : currStatus;
  }
  return newStatus;
}

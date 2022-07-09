import { AppServices } from '@app/app-services';
import { ErrorType } from '@app/commons/errors';
import { AuthRequest } from '@app/commons/request';
import { Response } from 'express';
import { z } from 'zod';

import { HttpErrorResponse } from '@app/libs/utils/errors';

import { OfferStatus, OfferStatusType } from '../get-offers';

export const updateOfferStatusController = (app: AppServices) => {
  return async (
    req: AuthRequest<{ offerId?: string }, {}, UpdateOfferRequestBody['body']>,
    res: Response,
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
        OfferStatus.archived,
        OfferStatus.draft,
        OfferStatus.published,
      ]),
    }),
  }),
});

export function verifyOfferStatus(
  currStatus: OfferStatusType,
  newStatus: OfferStatusType,
) {
  if (currStatus === 'archived') {
    return newStatus === 'draft' ? newStatus : currStatus;
  }
  return newStatus;
}

import { Response } from 'express';
import { AppServices } from '@app-services';
import { GetOfferResponse, OfferStatus } from '@commons/api/offers';
import { AuthRequest } from '@commons/request';
import { z } from 'zod';

export const updateOfferStatusController = (app: AppServices) => {
  return async (
    req: AuthRequest<{ offerId?: string }, {}, UpdateOfferRequestBody['body']>,
    res: Response<GetOfferResponse>,
  ) => {
    const {
      sender: { userId },
      params: { offerId },
      body: { offer },
    } = req;

    const updatedOffer = await app.dbClient.updateOffer({
      offerId: offerId!,
      updateOffer: { status: offer.status },
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

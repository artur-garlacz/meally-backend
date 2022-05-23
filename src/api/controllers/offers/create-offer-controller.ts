import { Request, Response } from 'express';
import { z } from 'zod';
import { AppServices } from '@app-services';
import {
  CreateOfferBody,
  GetOfferResponse,
  OfferStatus,
} from '@commons/api/offers';
import { UserRequest } from '@commons/api/users';
import { uuid } from '@libs/utils/common';

export const createOfferController = (app: AppServices) => {
  return async (
    req: UserRequest<{ offerId?: string }, {}, CreateOfferBody, {}>,
    res: Response,
  ) => {
    const {
      params: { offerId },
      body: { offer },
      user,
    } = req;

    const newOffer = await app.dbClient.createOffer({
      offerId: uuid(),
      title: offer.title,
      unitPrice: offer.unitPrice,
      longDesc: offer.longDesc,
      shortDesc: offer.shortDesc,
      status: OfferStatus.draft,
      availableQuantity: offer.availableQuantity,
      promoted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.userId,
      offerCategoryId: offer.offerCategoryId,
    });

    return res.status(200).send({ data: newOffer });
  };
};

export const createOfferSchema = z.object({
  body: z.object({
    offer: z.object({
      title: z.string({
        required_error: 'Title is required',
      }),
      unitPrice: z.number({ required_error: 'Unit price is required' }),
      longDesc: z.string({ required_error: 'Description is required' }),
      shortDesc: z
        .string({ required_error: 'Short description is required' })
        .max(300, 'Max length is 300 chars'),
      availableQuantity: z
        .string({ required_error: 'Short description is required' })
        .max(300, 'Max length is 300 chars'),
      offerCategoryId: z.string({ required_error: 'Category id is required' }),
    }),
  }),
});

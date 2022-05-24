import { Response } from 'express';
import { z } from 'zod';
import { AppServices } from '@app-services';
import { CreateOfferBody, OfferStatus } from '@commons/api/offers';
import { uuid } from '@libs/utils/common';
import { AuthRequest } from '@commons/request';

export const createOfferController = (app: AppServices) => {
  return async (
    req: AuthRequest<{}, {}, CreateOfferRequestBody['body'], {}>,
    res: Response,
  ) => {
    const {
      body: { offer },
      sender,
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
      userId: sender.userId,
      offerCategoryId: offer.offerCategoryId,
    });

    return res.status(200).send({ data: newOffer });
  };
};

type CreateOfferRequestBody = z.infer<typeof createOfferSchema>;

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
      availableQuantity: z.number({
        required_error: 'Available quantity is required',
      }),
      offerCategoryId: z.string({ required_error: 'Category id is required' }),
    }),
  }),
});

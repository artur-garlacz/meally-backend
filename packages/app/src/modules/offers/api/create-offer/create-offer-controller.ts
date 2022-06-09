import { AppServices } from '@app-services';
import { AuthRequest } from '@commons/request';
import { Response } from 'express';

import { uuid } from '@libs/utils/common';

import { OfferStatus } from '../get-offers';
import { CreateOfferRequestBody } from './create-offer-dtos';

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

import { AppServices } from '@app/app-services';
import { AuthRequest } from '@app/commons/request';
import { Response } from 'express';

import { uuid } from '@app/libs/utils/common';

import { QueueChannels, QueueCommands } from '@lib/commons/queue';
import { serializeJson } from '@lib/utils/serialization';

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

    await app.queueClient.channel.assertQueue(QueueChannels.offer);
    app.queueClient.channel.sendToQueue(
      QueueChannels.offer,
      Buffer.from(
        serializeJson({
          data: { ...newOffer, email: sender.email },
          type: QueueCommands.created,
        }),
      ),
    );

    return res.status(200).send({ data: newOffer });
  };
};

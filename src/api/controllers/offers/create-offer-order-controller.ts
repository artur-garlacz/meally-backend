import { Response } from 'express';
import { AppServices } from '@app-services';
import { GetOfferOrderResponse, OfferOrderStatus } from '@commons/api/offers';
import { AuthRequest } from '@commons/request';
import { z } from 'zod';
import { uuid } from '@libs/utils/common';

export const createOfferOrderController = (app: AppServices) => {
  return async (
    req: AuthRequest<
      { offerId?: string },
      {},
      CreateOfferOrderRequestBody['body']
    >,
    res: Response<GetOfferOrderResponse>,
  ) => {
    const {
      sender: { userId },
      params: { offerId },
      body: { offerOrder },
    } = req;

    const currOffer = await app.dbClient.getOfferById(offerId!);

    if (!currOffer) {
      return res.status(404).send({
        message: 'Offer not found',
        status: 'failed',
      });
    }

    const isQuantityEnough =
      currOffer.availableQuantity - offerOrder.quantity >= 0;

    if (!isQuantityEnough) {
      return res.status(403).send({
        message: 'The order cannot be continued due to insufficient quantity',
        status: 'failed',
      });
    }

    const newOrder = await app.dbClient.createOfferOrder({
      offerOrderId: uuid(),
      quantity: offerOrder.quantity,
      offerId: offerId!,
      customerId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: OfferOrderStatus.created,
    });

    return res.status(200).send({
      data: newOrder,
    });
  };
};

type CreateOfferOrderRequestBody = z.infer<typeof createOfferOrderSchema>;

export const createOfferOrderSchema = z.object({
  body: z.object({
    offerOrder: z.object({
      quantity: z.number({
        required_error: 'Quantity is required',
      }),
    }),
  }),
});

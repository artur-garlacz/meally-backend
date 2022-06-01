import { AppServices } from '@app-services';
import { Orders } from '@commons/api';
import { GetOrderResponse } from '@commons/api/orders';
import { ErrorType } from '@commons/errors';
import { AuthRequest } from '@commons/request';
import { Response } from 'express';
import { z } from 'zod';

import { uuid } from '@libs/utils/common';
import { HttpErrorResponse } from '@libs/utils/errors';

export const createOrderController = (app: AppServices) => {
  return async (
    req: AuthRequest<{ offerId?: string }, {}, CreateOrderRequestBody['body']>,
    res: Response<Orders.GetOrderResponse>,
  ) => {
    const {
      sender: { userId },
      params: { offerId },
      body: { offerOrder },
    } = req;

    const currOffer = await app.dbClient.getOfferById(offerId!);

    if (!currOffer) {
      throw new HttpErrorResponse(404, {
        message: 'Offer not found',
        kind: ErrorType.NotFound,
      });
    }

    const isQuantityEnough =
      currOffer.availableQuantity - offerOrder.quantity >= 0;

    const newOrder = await app.dbClient.runTransaction(
      async (dbTransaction) => {
        if (!isQuantityEnough) {
          throw new Error();
        }

        const order = await dbTransaction.createOrder({
          offerOrderId: uuid(),
          quantity: offerOrder.quantity,
          offerId: offerId!,
          customerId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: Orders.OrderStatus.created,
        });

        return order;
      },
    );

    // offerOrder.status != completed

    if (!isQuantityEnough) {
      throw new HttpErrorResponse(422, {
        message: 'The order cannot be continued due to insufficient quantity',
        kind: ErrorType.InsufficientQuantity,
      });
    }

    return res.status(200).send({
      data: newOrder,
    });
  };
};

type CreateOrderRequestBody = z.infer<typeof createOrderSchema>;

export const createOrderSchema = z.object({
  body: z.object({
    offerOrder: z.object({
      quantity: z.number({
        required_error: 'Quantity is required',
      }),
    }),
  }),
});

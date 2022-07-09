import { AppServices } from '@app/app-services';
import { ErrorType } from '@app/commons/errors';

import { HttpErrorResponse } from '@app/libs/utils/errors';

import { uuid } from '@lib/utils/common';

import { CreateOrderRequestBody } from '../api/create-order';
import { OrderStatus } from '../api/get-orders';

export const createOrder =
  (app: AppServices) =>
  async ({
    offerOrder,
    userId,
  }: CreateOrderRequestBody['body'] & { userId: string }) => {
    const currOffer = await app.dbClient.getOfferById(offerOrder.offerId);

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
          throw new HttpErrorResponse(422, {
            message:
              'The order cannot be continued due to insufficient quantity',
            kind: ErrorType.InsufficientQuantity,
          });
        }

        const order = await dbTransaction.createOrder({
          offerOrderId: uuid(),
          quantity: offerOrder.quantity,
          offerId: offerOrder.offerId,
          customerId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: OrderStatus.created,
        });

        return order;
      },
    );

    const customer = await app.dbClient.getUser(userId);
    const merchant = await app.dbClient.getUser(currOffer.userId);

    const totalPrice = currOffer.unitPrice * newOrder.quantity;
    // send event to customer
    await app.queueEmitter.createdOrder({
      orderType: 'customer',
      email: customer?.email!,
      totalPrice,
      title: currOffer.title,
      ...newOrder,
    });

    // send event to merchant
    await app.queueEmitter.createdOrder({
      orderType: 'merchant',
      email: merchant?.email!,
      totalPrice,
      title: currOffer.title,
      ...newOrder,
    });

    return newOrder;
  };

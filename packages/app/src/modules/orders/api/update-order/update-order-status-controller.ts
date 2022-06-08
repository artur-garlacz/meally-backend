import { AppServices } from '@app-services';
import { Orders } from '@commons/domain';
import { ErrorType } from '@commons/errors';
import { AuthRequest } from '@commons/request';
import { Response } from 'express';
import { z } from 'zod';

import { verifyOrderStatus } from '@api/services/update-order-status-service';

import { HttpErrorResponse } from '@libs/utils/errors';

export const updateOrderStatusController = (app: AppServices) => {
  return async (
    req: AuthRequest<
      { orderId?: string },
      {},
      UpdateOrderStatusRequestBody['body']
    >,
    res: Response,
  ) => {
    const {
      params: { orderId },
      body: { order },
    } = req;

    const currOrder = await app.dbClient.getOrderById({
      offerOrderId: orderId!,
    });

    if (!currOrder) {
      throw new HttpErrorResponse(404, {
        message: 'Order not found',
        kind: ErrorType.NotFound,
      });
    }

    const newStatus = verifyOrderStatus(currOrder.status, order.status);

    const updatedOrder = await app.dbClient.updateOrderStatus({
      orderId: orderId!,
      status: newStatus,
    });

    return res.status(200).send({
      data: updatedOrder,
    });
  };
};

type UpdateOrderStatusRequestBody = z.infer<typeof updateOrderStatusSchema>;

export const updateOrderStatusSchema = z.object({
  body: z.object({
    order: z.object({
      status: z.enum([
        Orders.OrderStatus.created,
        Orders.OrderStatus.accepted,
        Orders.OrderStatus.prepared,
        Orders.OrderStatus.delivered,
        Orders.OrderStatus.rejected,
      ]),
    }),
  }),
});

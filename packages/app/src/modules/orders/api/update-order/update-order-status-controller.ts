import { AppServices } from '@app/app-services';
import { AuthRequest } from '@app/commons/request';
import { Response } from 'express';

import { updateOrderStatus } from '@app/modules/orders/services/update-order-status-service';

import { UpdateOrderStatusRequestBody } from './update-order-dtos';

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

    const data = await updateOrderStatus(app)({
      orderId: orderId!,
      order,
    });

    return res.status(200).send(data);
  };
};

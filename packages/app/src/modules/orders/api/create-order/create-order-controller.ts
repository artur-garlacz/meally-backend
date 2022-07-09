import { AppServices } from '@app/app-services';
import { AuthRequest } from '@app/commons/request';
import { Response } from 'express';

import { createOrder } from '../../services/create-order-service';
import { CreateOrderRequestBody } from './create-order-dtos';

export const createOrderController = (app: AppServices) => {
  return async (
    req: AuthRequest<{}, {}, CreateOrderRequestBody['body']>,
    res: Response,
  ) => {
    const {
      sender: { userId },
      body: { offerOrder },
    } = req;

    const order = await createOrder(app)({ offerOrder, userId });

    return res.status(200).send({
      data: order,
    });
  };
};

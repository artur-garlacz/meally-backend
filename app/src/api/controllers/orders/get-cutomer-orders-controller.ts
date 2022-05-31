import { AppServices } from '@app-services';
import { Orders } from '@commons/api';
import { AuthRequest } from '@commons/request';
import { Response } from 'express';

export const getCutomerOrdersController = (app: AppServices) => {
  return async (
    req: AuthRequest<Orders.GetCustomerOrdersRequestQuery, {}, {}, {}>,
    res: Response,
  ) => {
    const {
      sender: { userId },
      params,
    } = req;

    const orders = await app.dbClient.getPaginatedCustomerOrders({
      customerId: userId,
      ...params,
    });
  };
};

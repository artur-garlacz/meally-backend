import { AppServices } from '@app-services';
import { Orders } from '@commons/api';
import { AuthRequest } from '@commons/request';
import { Response } from 'express';

export const getCutomerOrdersController = (app: AppServices) => {
  return async (
    req: AuthRequest<
      {},
      Orders.GetOrdersResponse,
      {},
      Orders.GetCustomerOrdersRequestQuery
    >,
    res: Response,
  ) => {
    const {
      sender: { userId },
      query: { page, perPage, status },
    } = req;

    const response = await app.dbClient.getPaginatedCustomerOrders({
      customerId: userId,
      page,
      perPage,
      status,
    });

    return res.status(200).send(response);
  };
};

import { AppServices } from '@app/app-services';
import { AuthRequest } from '@app/commons/request';
import { Response } from 'express';

import {
  GetCustomerOrdersRequestQuery,
  GetOrdersResponse,
} from './get-orders-dtos';

export const getCutomerOrdersController = (app: AppServices) => {
  return async (
    req: AuthRequest<{}, GetOrdersResponse, {}, GetCustomerOrdersRequestQuery>,
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

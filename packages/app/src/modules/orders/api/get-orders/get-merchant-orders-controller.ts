import { AppServices } from '@app/app-services';
import { AuthRequest } from '@app/commons/request';
import { Response } from 'express';

import {
  GetMerchantOrdersRequestQuery,
  GetOrdersResponse,
} from './get-orders-dtos';

export const getMerchantOrdersController = (app: AppServices) => {
  return async (
    req: AuthRequest<{}, GetOrdersResponse, {}, GetMerchantOrdersRequestQuery>,
    res: Response,
  ) => {
    const {
      sender: { userId },
      query: { page, perPage, status },
    } = req;

    const response = await app.dbClient.getPaginatedMerchantOrders({
      userId,
      page,
      perPage,
      status,
    });

    return res.status(200).send(response);
  };
};

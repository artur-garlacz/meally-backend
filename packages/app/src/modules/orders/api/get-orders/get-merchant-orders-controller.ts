import { AppServices } from '@app/app-services';
import { Request, Response } from 'express';

import {
  GetMerchantOrdersRequestQuery,
  GetOrdersResponse,
} from './get-orders-dtos';

export const getMerchantOrdersController = (app: AppServices) => {
  return async (
    req: Request<{}, GetOrdersResponse, {}, GetMerchantOrdersRequestQuery>,
    res: Response,
  ) => {};
};

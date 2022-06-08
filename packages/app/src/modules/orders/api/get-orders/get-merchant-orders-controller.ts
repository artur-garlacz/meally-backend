import { AppServices } from '@app-services';
import { Orders } from '@commons/domain';
import { Request, Response } from 'express';

import { HttpErrorResponse } from '@libs/utils/errors';

export const getMerchantOrdersController = (app: AppServices) => {
  return async (
    req: Request<
      {},
      Orders.GetOrdersResponse,
      {},
      Orders.GetMerchantOrdersRequestQuery
    >,
    res: Response,
  ) => {};
};

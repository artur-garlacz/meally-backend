import { AppServices } from '@app/app-services';
import { Router } from 'express';

import { authMiddleware } from '@app/api/middlewares/auth-middleware';
import { testAuthMiddleware } from '@app/api/middlewares/test-auth-middleware';
import { validateMiddleware } from '@app/api/middlewares/validator-middleware';

import { Environment } from '@app/libs/utils/env';
import { wrap } from '@app/libs/utils/express';

import { createOrderController, createOrderSchema } from './create-order';
import { getMerchantOrdersController } from './get-orders';
import { getCutomerOrdersController } from './get-orders';
import {
  updateOrderStatusController,
  updateOrderStatusSchema,
} from './update-order';

export function orderApiRouter(services: AppServices) {
  const { appConfig } = services;

  const router = Router();

  const auth =
    appConfig.environment === Environment.test
      ? testAuthMiddleware
      : authMiddleware(services.dbClient);

  //orders/:orderId/updateStatus  - PUT
  router.put(
    '/:orderId/update-status',
    auth,
    validateMiddleware(updateOrderStatusSchema),
    wrap(updateOrderStatusController(services)),
  );

  //orders/customer  <-- customerId
  router.get('/customer', auth, wrap(getCutomerOrdersController(services)));

  //orders/merchant   <-- userId
  router.get('/merchant', auth, wrap(getMerchantOrdersController(services)));

  router.post(
    '/create',
    auth,
    validateMiddleware(createOrderSchema),
    wrap(createOrderController(services)),
  );

  return router;
}

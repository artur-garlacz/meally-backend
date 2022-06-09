import { AppServices } from '@app-services';
import { Router } from 'express';

import { authMiddleware } from '@api/middlewares/auth-middleware';
import { testAuthMiddleware } from '@api/middlewares/test-auth-middleware';
import { validateMiddleware } from '@api/middlewares/validator-middleware';

import { Environment } from '@libs/utils/env';
import { wrap } from '@libs/utils/express';

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

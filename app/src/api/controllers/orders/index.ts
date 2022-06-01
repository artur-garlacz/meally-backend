import { AppServices } from '@app-services';
import { Router } from 'express';

import { authMiddleware } from '@api/middlewares/auth-middleware';
import { validateMiddleware } from '@api/middlewares/validator-middleware';

import { wrap } from '@libs/utils/express';

import {
  createOrderController,
  createOrderSchema,
} from './create-order-controller';
import { getCutomerOrdersController } from './get-cutomer-orders-controller';
import { getMerchantOrdersController } from './get-merchant-orders-controller';

export function orderApiRouter(services: AppServices) {
  const router = Router();

  const auth = authMiddleware(services.dbClient);
  // /:offerId/order   -
  // /:offerId/updateStatus  - PUT

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

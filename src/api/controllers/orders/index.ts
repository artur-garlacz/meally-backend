import { Router } from 'express';
import { wrap } from '@libs/utils/express';
import { AppServices } from '@app-services';
import { validateMiddleware } from '@api/middlewares/validator-middleware';
import { authMiddleware } from '@api/middlewares/auth-middleware';
import {
  createOrderController,
  createOrderSchema,
} from './create-order-controller';

export function orderApiRouter(services: AppServices) {
  const router = Router();

  const auth = authMiddleware(services.dbClient);
  // /:offerId/order   -
  // /:offerId/updateStatus  - PUT

  //orders/customer  <-- customerId

  //orders/merchant   <-- userId

  router.post(
    '/create',
    auth,
    validateMiddleware(createOrderSchema),
    wrap(createOrderController(services)),
  );

  return router;
}

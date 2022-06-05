import { AppServices } from '@app-services';
import { Router } from 'express';

import { getOffersController } from '@api/controllers/offers/get-offers-controller';
import { authMiddleware } from '@api/middlewares/auth-middleware';
import { validateMiddleware } from '@api/middlewares/validator-middleware';

import { wrap } from '@libs/utils/express';

import {
  createOfferController,
  createOfferSchema,
} from './create-offer-controller';
import { getOfferCategoriesController } from './get-offer-categories-controller';
import { getOfferController } from './get-offer-controller';
import {
  updateOfferStatusController,
  updateOfferStatusSchema,
} from './update-offer-status-controller';

export function offerApiRouter(services: AppServices) {
  const router = Router();

  const auth = authMiddleware(services.dbClient);
  // /:offerId/order   -
  // /:offerId/updateStatus  - PUT

  router.put(
    '/:offerId/update-status',
    auth,
    validateMiddleware(updateOfferStatusSchema),
    wrap(updateOfferStatusController(services)),
  );

  router.get('/:offerId', wrap(getOfferController(services)));

  router.post(
    '/create',
    auth,
    validateMiddleware(createOfferSchema),
    wrap(createOfferController(services)),
  );

  router.get('/category', wrap(getOfferCategoriesController(services)));

  router.get('/', wrap(getOffersController(services)));

  return router;
}

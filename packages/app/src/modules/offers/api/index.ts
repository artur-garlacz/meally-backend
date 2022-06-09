import { AppServices } from '@app-services';
import { Router } from 'express';

import { authMiddleware } from '@api/middlewares/auth-middleware';
import { testAuthMiddleware } from '@api/middlewares/test-auth-middleware';
import { validateMiddleware } from '@api/middlewares/validator-middleware';

import { Environment } from '@libs/utils/env';
import { wrap } from '@libs/utils/express';

import { createOfferController, createOfferSchema } from './create-offer';
import { getOfferController, getOffersController } from './get-offers';
import { getOfferCategoriesController } from './get-offers';
import {
  updateOfferStatusController,
  updateOfferStatusSchema,
} from './update-offer/update-offer-status-controller';

export function offerApiRouter(services: AppServices) {
  const { appConfig } = services;

  const router = Router();

  const auth =
    appConfig.environment === Environment.test
      ? testAuthMiddleware
      : authMiddleware(services.dbClient);

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

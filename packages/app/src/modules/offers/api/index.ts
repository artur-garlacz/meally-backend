import { AppServices } from '@app/app-services';
import { Router } from 'express';

import { authMiddleware } from '@app/api/middlewares/auth-middleware';
import { testAuthMiddleware } from '@app/api/middlewares/test-auth-middleware';
import { validateMiddleware } from '@app/api/middlewares/validator-middleware';

import { Environment } from '@app/libs/utils/env';
import { wrap } from '@app/libs/utils/express';

import { createOfferController, createOfferSchema } from './create-offer';
import {
  getMyOffersController,
  getOfferController,
  getOffersController,
} from './get-offers';
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

  router.post(
    '/create',
    auth,
    validateMiddleware(createOfferSchema),
    wrap(createOfferController(services)),
  );

  router.get('/category', wrap(getOfferCategoriesController(services)));

  // default
  router.get('/', wrap(getOffersController(services)));

  // my offers
  router.get('/my-offers', auth, wrap(getMyOffersController(services)));

  // /:offerId/updateStatus  - PUT
  router.put(
    '/:offerId/update-status',
    auth,
    validateMiddleware(updateOfferStatusSchema),
    wrap(updateOfferStatusController(services)),
  );

  router.get('/:offerId', wrap(getOfferController(services)));

  return router;
}

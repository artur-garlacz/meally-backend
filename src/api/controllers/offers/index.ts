import express from 'express';
import { wrap } from '@libs/utils/express';
import { AppServices } from '@app-services';
import { validateMiddleware } from '@api/middlewares/validator-middleware';
import { getOffersController } from '@api/controllers/offers/get-offers-controller';

export const offerApiRouter = (services: AppServices) => {
  const router = express.Router();

  router.post('/all', wrap(getOffersController(services)));

  return router;
};

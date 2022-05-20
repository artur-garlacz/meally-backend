import { Router } from 'express';
import { wrap } from '@libs/utils/express';
import { AppServices } from '@app-services';
import { getOffersController } from '@api/controllers/offers/get-offers-controller';
import { getOfferController } from './get-offer-controller';

export const offerApiRouter = (services: AppServices) => {
  const router = Router();

  // /:offerId/order   -
  // /:offerId/updateStatus  - PUT
  router.get('/:offerId/details', wrap(getOfferController(services)));
  router.get('/', wrap(getOffersController(services)));

  return router;
};

import { AppServices } from '@app-services';
import express from 'express';

import { registerUserController } from '@api/controllers/users/register-user-controller';
import { authMiddleware } from '@api/middlewares/auth-middleware';
import { validateMiddleware } from '@api/middlewares/validator-middleware';

import { wrap } from '@libs/utils/express';

import {
  createUserReviewController,
  createUserReviewSchema,
} from './create-user-review-controller';
import { getMyUserController } from './get-my-user-controller';
import { getUserReviewsController } from './get-user-reviews-controller';
import { authUserSchema, loginUserController } from './login-user-controller';
import { getUserDetailsController } from './user-details-controller';

export function userApiRouter(services: AppServices) {
  const router = express.Router();
  const auth = authMiddleware(services.dbClient);

  router.post(
    '/register',
    validateMiddleware(authUserSchema),
    wrap(registerUserController(services)),
  );

  router.post(
    '/login',
    validateMiddleware(authUserSchema),
    wrap(loginUserController(services)),
  );

  // basic auth user data
  router.get('/me', auth, wrap(getMyUserController(services)));

  // detailed auth user data
  router.get('/details', auth, wrap(getUserDetailsController(services)));

  // detailed auth user data
  router.get(
    '/:userId/details',
    auth,
    wrap(getUserDetailsController(services)),
  );

  // user reviews
  router.get('/:userId/reviews', wrap(getUserReviewsController(services)));

  router.post(
    '/:userId/reviews',
    auth,
    validateMiddleware(createUserReviewSchema),
    wrap(createUserReviewController(services)),
  );

  return router;
}

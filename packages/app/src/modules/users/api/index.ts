import { AppServices } from '@app-services';
import express from 'express';

import { authMiddleware } from '@api/middlewares/auth-middleware';
import { testAuthMiddleware } from '@api/middlewares/test-auth-middleware';
import { validateMiddleware } from '@api/middlewares/validator-middleware';

import { Environment } from '@libs/utils/env';
import { wrap } from '@libs/utils/express';

import {
  authRefreshTokenSchema,
  authUserSchema,
  loginUserController,
  logoutUserController,
  registerUserController,
} from './auth-user';
import { getMyUserController } from './get-user/get-my-user-controller';
import { getUserDetailsController } from './get-user/user-details-controller';
import {
  createUserReviewController,
  createUserReviewSchema,
} from './user-review';
import { getUserReviewsController } from './user-review/get-user-reviews-controller';

export function userApiRouter(services: AppServices) {
  const { appConfig } = services;

  const router = express.Router();
  const auth =
    appConfig.environment === Environment.test
      ? testAuthMiddleware
      : authMiddleware(services.dbClient);

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

  router.post(
    '/refresh-token',
    validateMiddleware(authRefreshTokenSchema),
    wrap(loginUserController(services)),
  );

  router.delete('/logout', wrap(logoutUserController(services)));

  // basic auth user data
  router.get('/me', auth, wrap(getMyUserController(services)));

  // detailed auth user data
  router.get('/details', auth, wrap(getUserDetailsController(services)));

  // detailed auth user data
  router.get('/:userId/details', wrap(getUserDetailsController(services)));

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

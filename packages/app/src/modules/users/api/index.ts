import { AppServices } from '@app/app-services';
import express from 'express';

import { authMiddleware } from '@app/api/middlewares/auth-middleware';
import { testAuthMiddleware } from '@app/api/middlewares/test-auth-middleware';
import { validateMiddleware } from '@app/api/middlewares/validator-middleware';

import { Environment } from '@app/libs/utils/env';
import { wrap } from '@app/libs/utils/express';

import {
  authRefreshTokenSchema,
  authUserSchema,
  loginUserController,
  logoutUserController,
  registerUserController,
} from './auth-user';
import { getUserDetailsController } from './get-user-details';
import { getMyUserController } from './get-user/get-my-user-controller';
import {
  createUserDetailsController,
  createUserDetailsSchema,
  updateUserDetailsController,
  updateUserDetailsSchema,
} from './upsert-user-details';
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

  router.post(
    '/details',
    auth,
    validateMiddleware(createUserDetailsSchema),
    wrap(createUserDetailsController(services)),
  );

  router.put(
    '/details',
    auth,
    validateMiddleware(updateUserDetailsSchema),
    wrap(updateUserDetailsController(services)),
  );

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

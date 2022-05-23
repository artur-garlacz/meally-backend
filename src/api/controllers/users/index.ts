import express from 'express';
import { wrap } from '@libs/utils/express';
import { AppServices } from '@app-services';
import { validateMiddleware } from '@api/middlewares/validator-middleware';
import { registerUserController } from '@api/controllers/users/register-user-controller';
import { authUserSchema, loginUserController } from './user-auth-controller';

export const userApiRouter = (services: AppServices) => {
  const router = express.Router();

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

  return router;
};

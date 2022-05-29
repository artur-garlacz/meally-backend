import express from 'express';
import { wrap } from '@libs/utils/express';
import { AppServices } from '@app-services';
import { validateMiddleware } from '@api/middlewares/validator-middleware';
import { registerUserController } from '@api/controllers/users/register-user-controller';
import { authMiddleware } from '@api/middlewares/auth-middleware';
import { getMyUserController } from './get-my-user-controller';
import { authUserSchema, loginUserController } from './login-user-controller';

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

  router.get('/me', auth, wrap(getMyUserController(services)));

  return router;
}

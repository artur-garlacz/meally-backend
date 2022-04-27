import express from 'express';
import { wrap } from '@libs/utils/express';
import { AppServices } from '@app-services';
import { validateMiddleware } from '@api/middlewares/validator-middleware';
import {
  registerUserController,
  createUserSchema,
} from '@api/controllers/users/register-user-controller';

export const userApiRouter = (services: AppServices) => {
  const router = express.Router();

  router.post(
    '/register',
    validateMiddleware(createUserSchema),
    wrap(registerUserController(services)),
  );

  return router;
};

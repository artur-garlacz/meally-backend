import { AppServices } from '@app/app-services';
import { Request, Response } from 'express';

import { registerUser } from '@app/modules/users/services';

import { AuthUserRequestBody } from './auth-user-dtos';

export const registerUserController = (app: AppServices) => {
  return async (
    req: Request<{}, {}, AuthUserRequestBody['body'], {}>,
    res: Response,
  ) => {
    const { user } = req.body;

    const newUser = await registerUser(app)(user);

    return res.status(200).send(newUser);
  };
};

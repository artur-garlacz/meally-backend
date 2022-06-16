import { AppServices } from '@app/app-services';
import { Request, Response } from 'express';

import { loginUser } from '@app/modules/users/services';

import { AuthUserRequestBody } from './auth-user-dtos';

export const loginUserController = (app: AppServices) => {
  return async (
    req: Request<{}, {}, AuthUserRequestBody['body'], {}>,
    res: Response,
  ) => {
    const data = await loginUser(app.dbClient)(req.body.user);

    return res.status(200).send(data);
  };
};

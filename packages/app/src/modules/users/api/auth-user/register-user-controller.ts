import { AppServices } from '@app-services';
import { ErrorType } from '@commons/errors';
import { Request, Response } from 'express';
import createError from 'http-errors';
import { z } from 'zod';

import { registerUser } from '@modules/users/services';

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

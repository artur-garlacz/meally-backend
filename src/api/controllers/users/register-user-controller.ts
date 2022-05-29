import { Request, Response } from 'express';
import createError from 'http-errors';
import { AppServices } from '@app-services';
import { z } from 'zod';
import AuthService from '@api/services/auth-service';
import { HttpErrorResponse } from '@libs/utils/errors';
import { ErrorType } from '@commons/errors';

export const registerUserController = (app: AppServices) => {
  return async (req: Request, res: Response) => {
    const {
      user: { email },
    } = req.body;

    const userExists = await app.dbClient.getUserByEmail(email);

    if (userExists) {
      throw new HttpErrorResponse(401, {
        message: 'User already exists',
        kind: ErrorType.HttpErrorResponse,
      });
    }

    const newUser = await new AuthService(app.dbClient).register(req.body.user);

    console.log(newUser, 'newUser');

    return res.status(200).send(newUser);
  };
};

export const createUserSchema = z.object({
  body: z.object({
    user: z.object({
      email: z
        .string({
          required_error: 'Email is required',
        })
        .email('Not a valid email'),
      password: z.string({ required_error: 'Password is required' }),
    }),
  }),
});

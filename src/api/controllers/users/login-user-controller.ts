import { Request, Response } from 'express';
import { AppServices } from '@app-services';
import { z } from 'zod';
import AuthService from '@api/services/auth-service';

export const loginUserController = (app: AppServices) => {
  return async (req: Request, res: Response) => {
    const data = await new AuthService(app.dbClient).login(req.body.user);

    return res.status(200).send(data);
  };
};

export const authUserSchema = z.object({
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

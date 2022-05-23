import { Request, Response } from 'express';
import { AppServices } from '@app-services';
import { z } from 'zod';
import AuthService from '@api/services/auth-service';

export const loginUserController = (app: AppServices) => {
  return async (req: Request, res: Response) => {
    try {
      const data = await new AuthService(app.dbClient).login(req.body.user);

      return res.status(200).send(data);
    } catch (e) {
      return res.status(e.statusCode || 404).send(e.message);
    }
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

export const refreshTokenController = (app: AppServices) => {
  return async (req: Request, res: Response) => {
    try {
      const data = await new AuthService(app.dbClient).refreshToken(
        req.body.refreshToken,
      );

      return res.status(200).json({
        status: true,
        message: 'New refresh token created!',
        data,
      });
    } catch (e) {
      return res.status(e.statusCode || 404).send(e.message);
    }
  };
};

export const logoutController = async (app: AppServices) => {
  return async (req: Request, res: Response) => {
    try {
      return res.status(200).json({
        status: true,
        message: 'Refresh token destroyed',
      });
    } catch (e) {
      return res.status(e.statusCode || 404).send(e.message);
    }
  };
};

export const authRefreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string({
      required_error: 'refreshToken is required',
    }),
  }),
});

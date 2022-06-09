import { AppServices } from '@app-services';
import { Request, Response } from 'express';

import { refreshToken } from '@modules/users/services';

import { AuthRefreshTokenRequestBody } from './auth-user-dtos';

export const refreshTokenController = (app: AppServices) => {
  return async (
    req: Request<{}, {}, AuthRefreshTokenRequestBody['body'], {}>,
    res: Response,
  ) => {
    const data = await refreshToken(req.body.refreshToken);

    return res.status(200).json({
      status: true,
      message: 'New refresh token created!',
      data,
    });
  };
};

import { ErrorType } from '@commons/errors';
import { AuthRequest } from '@commons/request';
import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';

import { DbClient } from '@libs/db';
import { HttpErrorResponse } from '@libs/utils/errors';
import { verifyAccessToken } from '@libs/utils/jwt';
import logger from '@libs/utils/logger';

export function authMiddleware(dbClient: DbClient) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      throw new HttpErrorResponse(401, {
        message: 'Access token is required',
        kind: ErrorType.Unauthorized,
      });
    }
    const token: string | null = req.headers.authorization.split(' ')[1];
    if (!token) {
      throw new HttpErrorResponse(401, {
        message: 'Access token is required',
        kind: ErrorType.Unauthorized,
      });
    }

    const data = (await verifyAccessToken(token)) as {
      userId: string;
    } | null;

    logger.info(data && data.userId);
    if (!data) {
      throw new HttpErrorResponse(401, {
        message: 'Access token is required',
        kind: ErrorType.Unauthorized,
      });
    }

    const user = await dbClient.getUser(data.userId);

    if (user) {
      (req as AuthRequest).sender = {
        userId: user.userId,
        email: user.email,
      };
    }

    next();
  };
}

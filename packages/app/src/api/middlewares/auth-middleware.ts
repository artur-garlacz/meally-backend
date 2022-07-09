import { ErrorType } from '@app/commons/errors';
import { AuthRequest } from '@app/commons/request';
import { NextFunction, Request, Response } from 'express';

import { DbClient } from '@app/libs/db';
import { HttpErrorResponse } from '@app/libs/utils/errors';
import { verifyAccessToken } from '@app/libs/utils/jwt';

import logger from '@lib/utils/logger';

export function authMiddleware(dbClient: DbClient) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
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
    } catch (err) {
      const status = Number(err.statusCode) || Number(err.status) || 500;

      res.status(status).send({
        message: err.message,
        kind: ErrorType.Unhandled,
      });
      return;
    }
  };
}

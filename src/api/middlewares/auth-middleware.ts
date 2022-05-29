import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { verifyAccessToken } from '@libs/utils/jwt';
import { DbClient } from '@libs/db';
import logger from '@libs/utils/logger';
import { AuthRequest } from '@commons/request';
import { HttpErrorResponse } from '@libs/utils/errors';
import { ErrorType } from '@commons/errors';

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
    } catch (e) {
      res.status(e.statusCode || 404).send(e.message);
    }
  };
}

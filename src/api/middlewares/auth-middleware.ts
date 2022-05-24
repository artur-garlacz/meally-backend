import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { verifyAccessToken } from '@libs/utils/jwt';
import { DbClient } from '@libs/db';
import logger from '@libs/utils/logger';
import { AuthRequest } from '@commons/request';

export function authMiddleware(dbClient: DbClient) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.headers.authorization, 'authorization');
      console.log(req.headers, 'req.headers');
      if (!req.headers.authorization) {
        throw new createError.Unauthorized('Access token is required');
      }
      const token: string | null = req.headers.authorization.split(' ')[1];
      if (!token) {
        throw new createError.Unauthorized();
      }

      console.log(token, 'token');
      const data = (await verifyAccessToken(token)) as {
        userId: string;
      } | null;
      console.log(data, 'userId');

      logger.info(data && data.userId);
      if (!data) {
        throw new createError.Unauthorized();
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

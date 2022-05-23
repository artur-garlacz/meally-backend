import { NextFunction, Response } from 'express';
import createError from 'http-errors';
import { verifyAccessToken } from '@libs/utils/jwt';
import { UserRequest } from '@commons/api/users';
import { DbClient } from '@libs/db';
import logger from '@libs/utils/logger';

export function authMiddleware(dbClient: DbClient) {
  return async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.headers.authorization) {
        throw new createError.Unauthorized('Access token is required');
      }
      const token: string | null = req.headers.authorization.split(' ')[1];
      if (!token) {
        throw new createError.Unauthorized();
      }
      await verifyAccessToken(token).then(async (data: any) => {
        logger.info(data);
        if (data.payload) {
          const user = await dbClient.getUser(data.payload);

          if (user) {
            req.user = user;
          }
        }
        next();
      });
    } catch (e) {
      res.status(e.statusCode || 404).send(e.message);
    }
  };
}

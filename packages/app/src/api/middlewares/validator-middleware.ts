import { ErrorType } from '@app/commons/errors';
import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

import logger from '@lib/utils/logger';

export const validateMiddleware =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (err) {
      const status = Number(err.statusCode) || Number(err.status) || 500;

      // eslint-disable-next-line no-console
      logger.error('Unhandled error', {
        status,
        err,
        errS: err.toString ? err.toString() : '',
      });

      return res.status(status).send({
        message: err,
        kind: ErrorType.Unhandled,
      });
    }
  };

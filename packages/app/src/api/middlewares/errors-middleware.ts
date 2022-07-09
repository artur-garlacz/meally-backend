import { ErrorType, HttpErrorResponseBody } from '@app/commons/errors';
import { NextFunction, Request, Response } from 'express';

import { HttpErrorResponse, TransformError } from '@app/libs/utils/errors';

import logger from '@lib/utils/logger';

export function errorsMiddleware() {
  return async (
    err: any,
    req: Request,
    res: Response<HttpErrorResponseBody>,
    _next: NextFunction,
  ): Promise<void> => {
    const request = {
      method: req.method,
      url: req.originalUrl,
      organizationId: res.locals.organizationId,
    };

    if (err instanceof HttpErrorResponse) {
      logger.error('HttpErrorResponse', err);
      res.status(err.statusCode).send(err.body);
      return;
    }

    if (err instanceof TransformError) {
      logger.error('TransformError', err);
      res.status(404).send({
        message: err.message,
        kind: ErrorType.Transform,
        validationErrors: err.validationErrors,
      });
      return;
    }

    const status = Number(err.statusCode) || Number(err.status) || 500;

    // eslint-disable-next-line no-console
    console.error(err?.stack);
    logger.error('Unhandled error', {
      request,
      status,
      err,
      errS: err.toString ? err.toString() : '',
    });
    res.status(status).send({
      message: err.message,
      kind: ErrorType.Unhandled,
    });
    return;
  };
}

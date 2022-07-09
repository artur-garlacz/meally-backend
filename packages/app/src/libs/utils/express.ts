import { AuthRequest } from '@app/commons/request';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as core from 'express-serve-static-core';

export function wrap<T extends RequestHandler | AuthRequestHandler>(fn: T) {
  return (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve()
      .then(() => fn(req as any, res, next))
      .catch(next);
}

type AuthRequestHandler<
  P extends core.Params = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
> = (
  req: AuthRequest<P, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
  next?: NextFunction,
) => any;

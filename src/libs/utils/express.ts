import { AuthRequest } from '@commons/request';
import * as core from 'express-serve-static-core';
import { NextFunction, Request, Response, RequestHandler } from 'express';

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

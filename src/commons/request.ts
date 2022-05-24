import { Request } from 'express';
import * as core from 'express-serve-static-core';

export type AuthRequest<
  P extends core.Params = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query,
> = Request<P, ResBody, ReqBody, ReqQuery> & {
  sender: RequestSender;
};

export type RequestSender = { userId: string; email: string | null };

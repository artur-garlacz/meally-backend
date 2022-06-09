import { Request } from 'express';

import { UserEntity } from '@modules/users/domain/entities';

export interface UserParam {
  user: UserEntity;
}
export type UserRequest<
  ParamsDictionary = {},
  ResBody = {},
  ReqBody = {},
  ReqQuery = {},
> = Request<ParamsDictionary, ResBody, ReqBody, ReqQuery> & UserParam;

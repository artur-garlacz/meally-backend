import { Request } from 'express';

import { UserEntity } from '@modules/users/entities';

export type UserCredentails = {
  email: string;
  password: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export interface UserParam {
  user: UserEntity;
}
export type UserRequest<
  ParamsDictionary = {},
  ResBody = {},
  ReqBody = {},
  ReqQuery = {},
> = Request<ParamsDictionary, ResBody, ReqBody, ReqQuery> & UserParam;
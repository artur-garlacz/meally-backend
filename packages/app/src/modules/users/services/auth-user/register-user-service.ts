import { ErrorType } from '@commons/errors';

import { DbClient } from '@libs/db';
import { uuid } from '@libs/utils/common';
import { HttpErrorResponse } from '@libs/utils/errors';
import { signAccessToken, signRefreshToken } from '@libs/utils/jwt';
import logger from '@libs/utils/logger';
import { toPasswordHash } from '@libs/utils/password';

import { AuthTokens, AuthUserRequestBody } from '@modules/users/api/auth-user';
import { UserEntity } from '@modules/users/domain/entities';

export const registerUser =
  (dbClient: DbClient) =>
  async ({
    password,
    email,
  }: AuthUserRequestBody['body']['user']): Promise<
    AuthTokens & { user: UserEntity }
  > => {
    const userExists = await dbClient.getUserByEmail(email);

    if (userExists) {
      throw new HttpErrorResponse(401, {
        message: 'User already exists',
        kind: ErrorType.HttpErrorResponse,
      });
    }

    const hashPassword = await toPasswordHash(password);

    const user = await dbClient.createUser({
      userId: uuid(),
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await dbClient.createUserPassword({
      userPasswordId: uuid(),
      password: hashPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.userId,
    });

    logger.info('[Action] User created');

    const accessToken = (await signAccessToken(user.userId)) as string;
    const refreshToken = (await signRefreshToken(user.userId)) as string;
    return { user, accessToken, refreshToken };
  };

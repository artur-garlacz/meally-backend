import { ErrorType } from '@app/commons/errors';

import { DbClient } from '@app/libs/db';
import { HttpErrorResponse } from '@app/libs/utils/errors';
import { signAccessToken, signRefreshToken } from '@app/libs/utils/jwt';
import { verifyPassword } from '@app/libs/utils/password';

import { AuthUserRequestBody } from '@app/modules/users/api/auth-user';

export const loginUser =
  (dbClient: DbClient) =>
  async ({ password, email }: AuthUserRequestBody['body']['user']) => {
    const user = await dbClient.getUserByEmail(email);

    if (!user) {
      throw new HttpErrorResponse(404, {
        message: 'User does not exist',
        kind: ErrorType.NotFound,
      });
    }

    const userPassword = await dbClient.getUserPassword({
      userId: user.userId,
    });

    if (!userPassword) {
      throw new HttpErrorResponse(404, {
        message: 'User password does not exist',
        kind: ErrorType.NotFound,
      });
    }

    const checkPassword = verifyPassword(userPassword.password, password);
    if (!checkPassword) {
      throw new HttpErrorResponse(401, {
        message: 'Email address or password not valid',
        kind: ErrorType.Unauthorized,
      });
    }

    const accessToken = await signAccessToken(user.userId);
    const refreshToken = await signRefreshToken(user.userId);

    return { email, accessToken, refreshToken };
  };

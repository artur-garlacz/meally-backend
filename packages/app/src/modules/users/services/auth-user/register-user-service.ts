import { AppServices } from '@app-services';
import { ErrorType } from '@commons/errors';

import { HttpErrorResponse } from '@libs/utils/errors';
import { signAccessToken, signRefreshToken } from '@libs/utils/jwt';
import logger from '@libs/utils/logger';
import { toPasswordHash } from '@libs/utils/password';
import { serializeJson } from '@libs/utils/serialization';

import { QueueChannels } from '@lib/commons/queue';
import { uuid } from '@lib/utils/common';

import { AuthTokens, AuthUserRequestBody } from '@modules/users/api/auth-user';
import { UserEntity } from '@modules/users/domain/entities';

export const registerUser =
  (app: AppServices) =>
  async ({
    password,
    email,
  }: AuthUserRequestBody['body']['user']): Promise<
    AuthTokens & { user: UserEntity }
  > => {
    const userExists = await app.dbClient.getUserByEmail(email);

    if (userExists) {
      throw new HttpErrorResponse(401, {
        message: 'User already exists',
        kind: ErrorType.HttpErrorResponse,
      });
    }

    const hashPassword = await toPasswordHash(password);

    const user = await app.dbClient.createUser({
      userId: uuid(),
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await app.dbClient.createUserPassword({
      userPasswordId: uuid(),
      password: hashPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.userId,
    });

    logger.info('[Action] User created');

    app.queueClient.channel.sendToQueue(
      QueueChannels.user,
      Buffer.from(serializeJson(user)),
    );

    logger.debug('[Action] Created user sent to queue');

    const accessToken = (await signAccessToken(user.userId)) as string;
    const refreshToken = (await signRefreshToken(user.userId)) as string;
    return { user, accessToken, refreshToken };
  };

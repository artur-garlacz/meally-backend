import { AppServices } from '@app/app-services';
import { ErrorType } from '@app/commons/errors';

import { HttpErrorResponse } from '@app/libs/utils/errors';
import { signAccessToken, signRefreshToken } from '@app/libs/utils/jwt';
import { toPasswordHash } from '@app/libs/utils/password';
import { serializeJson } from '@app/libs/utils/serialization';

import { QueueChannels, QueueCommands } from '@lib/commons/queue';
import { uuid } from '@lib/utils/common';
import logger from '@lib/utils/logger';

import {
  AuthTokens,
  AuthUserRequestBody,
} from '@app/modules/users/api/auth-user';
import { UserEntity } from '@app/modules/users/domain/entities';

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

    await app.queueClient.channel.assertQueue(QueueChannels.user);
    app.queueClient.channel.sendToQueue(
      QueueChannels.user,
      Buffer.from(serializeJson({ data: user, type: QueueCommands.created })),
    );

    logger.info('[Action] User created sent to queue');

    const accessToken = (await signAccessToken(user.userId)) as string;
    const refreshToken = (await signRefreshToken(user.userId)) as string;
    return { user, accessToken, refreshToken };
  };

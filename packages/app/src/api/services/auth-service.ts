import { AuthTokens, UserCredentails } from '@commons/api/users';
import { ErrorType } from '@commons/errors';
import bcrypt from 'bcrypt';

import { DbClient } from '@libs/db';
import { uuid } from '@libs/utils/common';
import { HttpErrorResponse } from '@libs/utils/errors';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '@libs/utils/jwt';
import logger from '@libs/utils/logger';

import { UserEntity } from '@modules/users/entities';

class AuthService {
  dbClient: DbClient;

  constructor(dbClient: DbClient) {
    this.dbClient = dbClient;
  }

  async register({
    password,
    email,
  }: UserCredentails): Promise<
    AuthTokens & { user: Omit<UserEntity, 'password'> }
  > {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await this.dbClient.createUser({
      userId: uuid(),
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.dbClient.createUserPassword({
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
  }

  async login({ email, password }: UserCredentails) {
    const user = await this.dbClient.getUserByEmail(email);

    if (!user) {
      throw new HttpErrorResponse(404, {
        message: 'User does not exist',
        kind: ErrorType.NotFound,
      });
    }

    const userPassword = await this.dbClient.getUserPassword({
      userId: user.userId,
    });

    if (!userPassword) {
      throw new HttpErrorResponse(404, {
        message: 'User password does not exist',
        kind: ErrorType.NotFound,
      });
    }

    const checkPassword = bcrypt.compareSync(password, userPassword.password);
    if (!checkPassword) {
      throw new HttpErrorResponse(401, {
        message: 'Email address or password not valid',
        kind: ErrorType.Unauthorized,
      });
    }

    const accessToken = await signAccessToken(user.userId);
    const refreshToken = await signRefreshToken(user.userId);

    return { email, accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    const userId = (await verifyRefreshToken(refreshToken)) as string;
    const accessToken = await signAccessToken(userId);
    const newRefreshToken = await signRefreshToken(userId);
    return { refreshToken: newRefreshToken, accessToken };
  }

  async logout(refreshToken: string) {
    // const userId = (await verifyRefreshToken(refreshToken)) as number;
    return {};
  }
}

export default AuthService;

import bcrypt from 'bcrypt';
import createError from 'http-errors';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '@libs/utils/jwt';
import { DbClient } from '@libs/db';
import logger from '@libs/utils/logger';
import { AuthTokens, UserCredentails } from '@commons/api/users';
import { uuid } from '@libs/utils/common';
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

    const {
      password: { p },
      ...user
    } = await this.dbClient.createUser({
      userId: uuid(),
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: hashPassword,
    });

    logger.info('User created');

    const accessToken = (await signAccessToken(user.userId)) as string;
    const refreshToken = (await signRefreshToken(user.userId)) as string;
    console.log(user, 'user');
    return { user, accessToken, refreshToken };
  }

  async login({ email, password }: UserCredentails) {
    if (!email || !password) {
      throw new createError.Unauthorized('Email address or password not exist');
    }

    const user = await this.dbClient.getUserByEmail(email);

    if (!user) {
      throw new createError.NotFound('User does not exist');
    }
    const checkPassword = bcrypt.compareSync(password, user.password);
    if (!checkPassword)
      throw new createError.Unauthorized('Email address or password not valid');

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

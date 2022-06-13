import { ErrorType } from '@commons/errors';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';

import { getEnv } from './env';
import { HttpErrorResponse } from './errors';

const accessTokenSecret = getEnv('ACCESS_TOKEN_SECRET');
const refreshTokenSecret = getEnv('REFRESH_TOKEN_SECRET');
const accessTokenTTL = getEnv('ACCESS_TOKEN_TTL');
const refreshTokenTTL = getEnv('REFRESH_TOKEN_TTL');

export const signAccessToken = (userId: string) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userId },
      accessTokenSecret ?? '',
      { expiresIn: accessTokenTTL ?? '15m', audience: userId },
      (err, token) => {
        if (err) {
          reject(new createError.InternalServerError());
        }
        resolve(token);
      },
    );
  });
};

export const signRefreshToken = (userId: string) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userId },
      accessTokenSecret ?? '',
      { expiresIn: refreshTokenTTL ?? '3d', audience: userId },
      (err, token) => {
        if (err) {
          reject(new createError.InternalServerError());
        }

        // userId.toString(), token, { EX: 365 * 24 * 60 * 60 };
        // client
        //   .set(`${userId}`, `${token}`, {
        //     EX: 365 * 24 * 60 * 60,
        //   })
        //   .then((res) => {
        //     console.log(res);
        //     resolve(res);
        //   });

        resolve(token);
      },
    );
  });
};

export const verifyAccessToken = (token: string) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, accessTokenSecret ?? '', (err, payload) => {
      if (err) {
        const message =
          err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message;
        return reject(
          new HttpErrorResponse(401, {
            message: 'Access token is required',
            kind: ErrorType.Unauthorized,
          }),
        );
      }
      resolve(payload);
    });
  });

export const verifyRefreshToken = (token: string) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, refreshTokenSecret ?? '', (err, payload) => {
      if (err) {
        const message =
          err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message;
        return reject(new createError.Unauthorized(message));
      }
      resolve(payload);
    });
  });

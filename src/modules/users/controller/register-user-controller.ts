import { Request, Response } from 'express';
import { AppServices } from '@app-services';
import { uuid } from '@libs/utils/common';

export const registerUserController = (app: AppServices) => {
  return async (req: Request, res: Response<any>) => {
    const { email, password } = req.body;

    const createdUser = await app.dbClient.createUser({
      userId: uuid(),
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
      password,
    });

    return res
      .status(200)
      .send({ userId: createdUser.userId, roles: [], email });
  };
};

import { Request, Response } from 'express';
import { AppServices } from '@app-services';
import { uuid } from '@libs/utils/common';
import { z } from 'zod';
import bcrypt from 'bcrypt';

export const registerUserController = (app: AppServices) => {
  return async (req: Request, res: Response) => {
    const {
      user: { email, password },
    } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const createdUser = await app.dbClient.createUser({
      userId: uuid(),
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: hashPassword,
    });

    return res.status(200).send({ userId: createdUser.userId, email });
  };
};

export const createUserSchema = z.object({
  body: z.object({
    user: z.object({
      email: z
        .string({
          required_error: 'Email is required',
        })
        .email('Not a valid email'),
      password: z.string({ required_error: 'Password is required' }),
    }),
  }),
});

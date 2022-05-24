import { AppServices } from '@app-services';
import { AuthRequest } from '@commons/request';
import { Response } from 'express';

export const getMyUserController = (_app: AppServices) => {
  return async (req: AuthRequest, res: Response) => {
    return res.status(200).send({
      userId: req.sender.userId,
      email: req.sender.email,
    });
  };
};

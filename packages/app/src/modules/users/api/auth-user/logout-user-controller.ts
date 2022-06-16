import { AppServices } from '@app/app-services';
import { Request, Response } from 'express';

export const logoutUserController = (app: AppServices) => {
  return async (req: Request, res: Response) => {
    return res.status(200).json({
      status: true,
      message: 'Refresh token destroyed',
    });
  };
};

import { AppServices } from '@app/app-services';
import { ErrorType } from '@app/commons/errors';
import { AuthRequest } from '@app/commons/request';
import { Response } from 'express';

import { HttpErrorResponse } from '@app/libs/utils/errors';

export const getUserDetailsController = (app: AppServices) => {
  return async (req: AuthRequest<{ userId?: string }>, res: Response) => {
    const { sender, params } = req;

    const userId = params.userId
      ? params.userId
      : sender
      ? sender.userId
      : null;

    if (!userId) {
      throw new HttpErrorResponse(404, {
        message: 'User details not found',
        kind: ErrorType.NotFound,
      });
    }

    const userDetails = await app.dbClient.getUserDetails(userId);

    if (!userDetails) {
      throw new HttpErrorResponse(404, {
        message: 'User details not found',
        kind: ErrorType.NotFound,
      });
    }

    return res.status(200).send({ data: userDetails });
  };
};

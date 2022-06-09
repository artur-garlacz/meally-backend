import { AppServices } from '@app-services';
import { AuthRequest } from '@commons/request';
import { Response } from 'express';

import { uuid } from '@libs/utils/common';

import { CreateUserReviewRequestBody } from './user-review-dtos';

export const createUserReviewController = (app: AppServices) => {
  return async (
    req: AuthRequest<
      { userId?: string },
      {},
      CreateUserReviewRequestBody['body'],
      {}
    >,
    res: Response,
  ) => {
    const {
      params: { userId },
      body: { userReview },
      sender,
    } = req;

    const newUserReview = await app.dbClient.createUserReview({
      userReviewId: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      rate: userReview.rate,
      message: userReview.message,
      userId: userId!,
      customerId: sender.userId,
    });

    return res.status(200).send({ data: newUserReview });
  };
};

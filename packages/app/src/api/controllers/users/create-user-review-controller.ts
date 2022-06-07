import { AppServices } from '@app-services';
import { OfferStatus } from '@commons/api/offers';
import { AuthRequest } from '@commons/request';
import { Response } from 'express';
import { z } from 'zod';

import { uuid } from '@libs/utils/common';

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

type CreateUserReviewRequestBody = z.infer<typeof createUserReviewSchema>;

export const createUserReviewSchema = z.object({
  body: z.object({
    userReview: z.object({
      rate: z
        .number({ required_error: 'Rate is required' })
        .min(1, 'Min value is 1')
        .max(5, 'Max value is 5'),
      message: z.string({ required_error: 'Message is required' }),
    }),
  }),
});

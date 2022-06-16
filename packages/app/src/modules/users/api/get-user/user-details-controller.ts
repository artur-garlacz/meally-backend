import { AppServices } from '@app/app-services';
import { ErrorType } from '@app/commons/errors';
import { AuthRequest } from '@app/commons/request';
import { Response } from 'express';
import { z } from 'zod';

import { HttpErrorResponse } from '@app/libs/utils/errors';

import { uuid } from '@lib/utils/common';

export const createOrUpdateUserDetailsController = (app: AppServices) => {
  return async (req: AuthRequest, res: Response<any>) => {
    const { address1, address2, city, postalCode, country, phoneNumber } =
      req.body;
    const { userId } = req.sender;

    const isUserDetailExists = await app.dbClient.getUserDetails(userId);

    let userDetails;
    if (isUserDetailExists) {
      userDetails = await app.dbClient.updateUserDetails({
        userDetailsId: isUserDetailExists.userDetailsId,
        address1,
        address2,
        city,
        postalCode,
        country,
        phoneNumber,
      });
    } else {
      userDetails = await app.dbClient.createUserDetails({
        userDetailsId: uuid(),
        address1,
        address2,
        city,
        postalCode,
        country,
        phoneNumber,
        userId,
      });
    }

    return res.status(200).send({ userDetails });
  };
};

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

export const createUserDetailsSchema = z.object({
  body: z.object({
    address1: z.string({
      required_error: 'Address1 is required',
    }),
    address2: z.string().optional(),
    city: z.string({
      required_error: 'City is required',
    }),
    postalCode: z.string({
      required_error: 'Postal code is required',
    }),
    country: z.string({
      required_error: 'Country is required',
    }),
    phoneNumber: z.string({
      required_error: 'Phone number is required',
    }),
  }),
});

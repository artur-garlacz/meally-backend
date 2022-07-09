import { AppServices } from '@app/app-services';
import { ErrorType } from '@app/commons/errors';
import { AuthRequest } from '@app/commons/request';
import { Response } from 'express';
import { z } from 'zod';

import { HttpErrorResponse } from '@app/libs/utils/errors';

import { UserDetailsEntity } from '../../domain/entities';

export const updateUserDetailsController = (app: AppServices) => {
  return async (
    req: AuthRequest,
    res: Response<{ userDetails: UserDetailsEntity }>,
  ) => {
    const { address1, address2, city, postalCode, country, phoneNumber } =
      req.body;
    const { userId } = req.sender;

    const isUserDetailExists = await app.dbClient.getUserDetails(userId);

    if (!isUserDetailExists) {
      throw new HttpErrorResponse(404, {
        message: 'User details not found',
        kind: ErrorType.NotFound,
      });
    }

    const userDetails = await app.dbClient.updateUserDetails({
      userDetailsId: isUserDetailExists.userDetailsId,
      address1,
      address2: address2 || null,
      city,
      postalCode,
      country,
      phoneNumber,
    });

    return res.status(200).send({ userDetails });
  };
};

export const updateUserDetailsSchema = z.object({
  body: z.object({
    address1: z
      .string({
        required_error: 'Address1 is required',
      })
      .optional(),
    address2: z.string().optional(),
    city: z
      .string({
        required_error: 'City is required',
      })
      .optional(),
    postalCode: z
      .string({
        required_error: 'Postal code is required',
      })
      .optional(),
    country: z
      .string({
        required_error: 'Country is required',
      })
      .optional(),
    phoneNumber: z
      .string({
        required_error: 'Phone number is required',
      })
      .optional(),
  }),
});

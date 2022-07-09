import { AppServices } from '@app/app-services';
import { AuthRequest } from '@app/commons/request';
import { Response } from 'express';
import { z } from 'zod';

import { uuid } from '@lib/utils/common';

import { UserDetailsEntity } from '../../domain/entities';

export const createUserDetailsController = (app: AppServices) => {
  return async (
    req: AuthRequest,
    res: Response<{ userDetails: UserDetailsEntity }>,
  ) => {
    const { address1, address2, city, postalCode, country, phoneNumber } =
      req.body;
    const { userId } = req.sender;

    const isUserDetailExists = await app.dbClient.getUserDetails(userId);

    let userDetails;
    if (isUserDetailExists) {
      userDetails = await app.dbClient.updateUserDetails({
        userDetailsId: isUserDetailExists.userDetailsId,
        address1,
        address2: address2 || null,
        city,
        postalCode,
        country,
        phoneNumber,
      });
    } else {
      userDetails = await app.dbClient.createUserDetails({
        userDetailsId: uuid(),
        address1,
        address2: address2 || null,
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

import { AppServices } from '@app-services';
import { AuthRequest } from '@commons/request';
import { Response } from 'express';
import { z } from 'zod';

import { uuid } from '@libs/utils/common';

export const createOrUpdateUserDetailsController = (app: AppServices) => {
  return async (req: AuthRequest, res: Response<any>) => {
    const { address1, address2, city, postalCode, country, phoneNumber } =
      req.body;
    const { userId } = req.sender;

    const isUserDetailExists = await app.dbClient.getUserDetails(userId);

    if (isUserDetailExists) {
      const userDetails = await app.dbClient.createUserDetails({
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

    const userDetails = await app.dbClient.createUserDetails({
      userDetailsId: uuid(),
      address1,
      address2,
      city,
      postalCode,
      country,
      phoneNumber,
      userId,
    });

    return res.status(200).send({ userDetails });
  };
};

export const getUserDetailsController = (app: AppServices) => {
  return async (req: AuthRequest, res: Response<any>) => {
    const { userId } = req.sender;
    const userDetails = await app.dbClient.getUserDetails(userId);

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

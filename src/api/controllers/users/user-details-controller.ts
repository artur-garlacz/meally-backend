import { Request, Response } from 'express';
import { AppServices } from '@app-services';
import { uuid } from '@libs/utils/common';
import { z } from 'zod';

export const createUserDetailsController = (app: AppServices) => {
  return async (req: Request, res: Response<any>) => {
    const { address1, address2, city, postalCode, country, phoneNumber } =
      req.body;

    const userDetails = await app.dbClient.createUserDetails({
      userAddressId: uuid(),
      address1,
      address2,
      city,
      postalCode,
      country,
      phoneNumber,
      userId: '',
    });

    return res.status(200).send({ userDetails });
  };
};

export const getUserDetailsController = (app: AppServices) => {
  return async (req: Request, res: Response<any>) => {
    const userId = 'sad'; // get from req
    const userDetails = await app.dbClient.getUserDetails(userId);

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

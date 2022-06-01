// user, user-details, settings
// oferty (ilosc porcji, cena), meals
// order
import { CommonQueryMethods, sql } from 'slonik';

import logger from '@libs/utils/logger';
import { chainOptional, toOptional } from '@libs/utils/query';
import { serializeDate } from '@libs/utils/serialization';

import { UserDetailsEntity, UserEntity } from './entities';

export function usersQueries(db: CommonQueryMethods) {
  return Object.freeze({
    createUser(user: UserEntity): Promise<UserEntity> {
      logger.debug('DbClient.createUser', user);

      return db.one(sql`
            INSERT INTO "user" (
                "userId",
                "email",
                "password",
                "createdAt",
                "updatedAt"
            ) VALUES (
                ${user.userId},
                ${user.email},
                ${user.password},
                ${serializeDate(user.createdAt)},
                ${serializeDate(user.updatedAt)}
            ) RETURNING *`);
    },
    getUser(userId: UserEntity['userId']): Promise<UserEntity | null> {
      return db
        .maybeOne(
          sql`
        SELECT * FROM "user" WHERE "userId"=${userId}`,
        )
        .then(toOptional(UserEntity));
    },
    getUserByEmail(userEmail: UserEntity['email']): Promise<UserEntity | null> {
      return db
        .maybeOne(
          sql`
        SELECT * FROM "user" WHERE "email"=${userEmail}`,
        )
        .then(toOptional(UserEntity));
    },
    createUserDetails(
      userDetails: UserDetailsEntity,
    ): Promise<UserDetailsEntity> {
      logger.debug('DbClient.createUserDetails', userDetails);

      return db.one(sql`
            INSERT INTO "userDetails" (
              "userDetailsId",
              "address1",
              "address2",
              "city",
              "postalCode",
              "country",
              "phoneNumber",
              "userId"
            ) VALUES (
                ${userDetails.userDetailsId},
                ${userDetails.address1},
                ${userDetails.address2},
                ${userDetails.city},
                ${userDetails.postalCode},
                ${userDetails.country},
                ${userDetails.phoneNumber},
                ${userDetails.userId}
            ) RETURNING *`);
    },
    updateUserDetails(
      userDetails: Partial<
        Omit<UserDetailsEntity, 'userId' | 'userDetailsId'>
      > &
        Pick<UserDetailsEntity, 'userDetailsId'>,
    ): Promise<UserDetailsEntity> {
      logger.debug('DbClient.updateUserDetails', userDetails);

      return db.one(sql`
          UPDATE "offer"
          SET
          ${chainOptional(
            {
              address1: userDetails.address1,
              address2: userDetails.address2,
              city: userDetails.city,
              postalCode: userDetails.postalCode,
              country: userDetails.country,
              phoneNumber: userDetails.phoneNumber,
            },
            'update',
          )}
          WHERE "userDetailsId" = ${userDetails.userDetailsId}
          RETURNING *`);
    },
    getUserDetails(userId: string): Promise<UserDetailsEntity | null> {
      logger.debug('DbClient.getUserDetails');
      return db
        .maybeOne(
          sql`
      SELECT * FROM "userDetails" WHERE "userId"=${userId} `,
        )
        .then(toOptional(UserDetailsEntity));
    },
  });
}

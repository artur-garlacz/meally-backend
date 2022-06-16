// user, user-details, settings
// oferty (ilosc porcji, cena), meals
// order
import { CommonQueryMethods, sql } from 'slonik';

import { chainOptional, toOptional } from '@app/libs/utils/query';

import logger from '@lib/utils/logger';
import { serializeDate } from '@lib/utils/serialization';

import { UserDetailsEntity, UserEntity, UserPasswordEntity } from './entities';

export function usersQueries(db: CommonQueryMethods) {
  return Object.freeze({
    createUser(user: UserEntity): Promise<UserEntity> {
      logger.info('DbClient.createUser');

      return db.one(sql`
            INSERT INTO "user" (
                "userId",
                "email",
                "createdAt",
                "updatedAt"
            ) VALUES (
                ${user.userId},
                ${user.email},
                ${serializeDate(user.createdAt)},
                ${serializeDate(user.updatedAt)}
            ) RETURNING *`);
    },
    createUserPassword(
      userPassword: UserPasswordEntity,
    ): Promise<UserPasswordEntity> {
      logger.info('DbClient.createUserPassword');

      return db.one(sql`
            INSERT INTO "userPassword" (
                "userPasswordId",
                "password",
                "createdAt",
                "updatedAt",
                "userId"
            ) VALUES (
                ${userPassword.userPasswordId},
                ${userPassword.password},
                ${serializeDate(userPassword.createdAt)},
                ${serializeDate(userPassword.updatedAt)},
                ${userPassword.userId}
            ) RETURNING *`);
    },
    getUserPassword({
      userId,
    }: {
      userId: UserPasswordEntity['userId'];
    }): Promise<UserPasswordEntity | null> {
      logger.info('DbClient.getUserPassword');

      return db
        .maybeOne(
          sql`
        SELECT * FROM "userPassword" WHERE "userId"=${userId}`,
        )
        .then(toOptional(UserPasswordEntity));
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
      logger.info('DbClient.createUserDetails');

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
      logger.info('DbClient.updateUserDetails', userDetails);

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
      logger.info('DbClient.getUserDetails');
      return db
        .maybeOne(
          sql`
      SELECT * FROM "userDetails" WHERE "userId"=${userId} `,
        )
        .then(toOptional(UserDetailsEntity));
    },
  });
}

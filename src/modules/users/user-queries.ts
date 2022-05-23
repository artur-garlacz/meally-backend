// user, user-details, settings
// oferty (ilosc porcji, cena), meals
// order

import logger from '@libs/utils/logger';
import { toOptional, toRequired } from '@libs/utils/query';
import { serializeDate } from '@libs/utils/serialization';
import { CommonQueryMethods, sql } from 'slonik';
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
        SELECT "userId", "email", "createdAt", "updatedAt" FROM "user" WHERE "userId"=${userId}`,
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

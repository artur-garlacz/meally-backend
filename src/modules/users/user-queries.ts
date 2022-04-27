// user, user-details, settings
// oferty (ilosc porcji, cena), meals
// order

import logger from '@libs/utils/logger';
import { serializeDate } from '@libs/utils/serialization';
import { CommonQueryMethods, sql } from 'slonik';
import { UserDetailsEntity, UserEntity } from './entities';

export function usersQueries(db: CommonQueryMethods) {
  return Object.freeze({
    createUser(user: UserEntity): Promise<UserEntity> {
      logger.debug('DbClient.createUser', user);

      return db.one(sql`
            INSERT INTO "users" (
                "userId",
                "email",
                "password",
                "createdAt",
                "updatedAt",
            ) VALUES (
                ${user.userId},
                ${user.email},
                ${user.password},
                ${serializeDate(user.createdAt)},
                ${serializeDate(user.updatedAt)},
            ) RETURNING *`);
    },
    createUserDetails(
      userDetails: UserDetailsEntity,
    ): Promise<UserDetailsEntity> {
      logger.debug('DbClient.createUserDetails', userDetails);

      return db.one(sql`
            INSERT INTO "users" (
              "address1",
              "address2",
              "city",
              "postalCode",
              "country",
              "phoneNumber",
              "userId"
            ) VALUES (
                ${userDetails.userId},
                ${userDetails.address1},
                ${userDetails.address2},
                ${userDetails.city},
                ${userDetails.postalCode},
                ${userDetails.country},
                ${userDetails.phoneNumber},
                ${userDetails.userId},
            ) RETURNING *`);
    },
  });
}

// user, user-details, settings
// oferty (ilosc porcji, cena), meals
// order

import logger from '@libs/utils/logger';
import { serializeDate } from '@libs/utils/serialization';
import { CommonQueryMethods, sql } from 'slonik';
import { UserEntity } from './user-entity';

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
  });
}

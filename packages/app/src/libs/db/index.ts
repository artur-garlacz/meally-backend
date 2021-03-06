import {
  CommonQueryMethods,
  DatabasePool,
  DatabaseTransactionConnection,
} from 'slonik';

import { offersQueries } from '@app/modules/offers/domain/offer-queries';
import { ordersQueries } from '@app/modules/orders/domain/order-quieres';
import { reviewsQueries } from '@app/modules/reviews/domain/review-queries';
import { usersQueries } from '@app/modules/users/domain/user-queries';

import { wrapDbClientByErrorLogger } from './setup';

export type DbClient = ReturnType<typeof createDbClient>;
export type DbQueries = ReturnType<typeof createDbQueries>;

export function createDbClient(pool: DatabasePool) {
  return Object.freeze({
    ...createDbQueries(pool),
    runTransaction<T>(handler: (transactionQueries: DbQueries) => Promise<T>) {
      return pool.transaction((transaction) =>
        handler(createDbQueries(transaction)),
      );
    },
  });
}

export function createDbQueries(
  unwrappedDb: DatabasePool | DatabaseTransactionConnection,
) {
  const db = wrapDbClientByErrorLogger(unwrappedDb);
  return Object.freeze({
    async adhoc<T>(fn: (db: CommonQueryMethods) => Promise<T>): Promise<T> {
      return fn(db);
    },
    ...usersQueries(db),
    ...offersQueries(db),
    ...ordersQueries(db),
    ...reviewsQueries(db),
  });
}

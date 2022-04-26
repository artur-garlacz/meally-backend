import { usersQueries } from '@modules/users/user-queries';
import {
  CommonQueryMethods,
  DatabasePool,
  DatabaseTransactionConnection,
} from 'slonik';
import { wrapDbClientByErrorLogger } from './setup';

export type DbClient = ReturnType<typeof createDbClient>;
export type DbQueries = any;

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
  });
}

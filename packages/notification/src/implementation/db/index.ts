import { DatabasePool } from 'slonik';
import { createDbQueries, DbQueries } from './queries';

export type DbClient = ReturnType<typeof createDbClient>;

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

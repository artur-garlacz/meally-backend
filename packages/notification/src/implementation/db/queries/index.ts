import {
  CommonQueryMethods,
  DatabasePool,
  DatabaseTransactionConnection,
} from 'slonik';

import { wrapDbClientByErrorLogger } from '../setup';

import { emailsQueries } from './email-queries';

export type DbQueries = ReturnType<typeof createDbQueries>;

export function createDbQueries(
  unwrappedDb: DatabasePool | DatabaseTransactionConnection,
) {
  const db = wrapDbClientByErrorLogger(unwrappedDb);
  return Object.freeze({
    async adhoc<T>(fn: (db: CommonQueryMethods) => Promise<T>): Promise<T> {
      return fn(db);
    },
    ...emailsQueries(db),
  });
}

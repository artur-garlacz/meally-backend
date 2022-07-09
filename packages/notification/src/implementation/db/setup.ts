import {
  CommonQueryMethods,
  DatabasePool,
  DatabaseTransactionConnection,
  IntegrityConstraintViolationError,
  createPool,
  sql,
} from 'slonik';
import { createInterceptors } from 'slonik-interceptor-preset';

import { sleep } from '@lib/utils/common';
import logger from '@lib/utils/logger';
import { AppConfig } from '@notify/utils/config';

type WrappedDbClient = CommonQueryMethods & {
  transaction: DatabasePool['transaction'];
};

export function wrapDbClientByErrorLogger(
  unwrappedDb: DatabasePool | DatabaseTransactionConnection,
): WrappedDbClient {
  const dbErrorsLogger = (error: any): never => {
    if (error instanceof IntegrityConstraintViolationError) {
      logger.error('Database IntegrityConstraintViolationError', {
        constraint: error.constraint,
        table: (error?.originalError as any)?.table,
      });
    }
    logger.error('Database error', { errorBody: error.message });
    throw error;
  };

  const wrapErrorLog = <R, F extends (...args: any[]) => Promise<R>>(
    func: F,
  ) => {
    return (...args: any[]) => {
      return func(...args).catch(dbErrorsLogger);
    };
  };

  const wrappedDb: WrappedDbClient = {
    any: wrapErrorLog(unwrappedDb.any),
    anyFirst: wrapErrorLog(unwrappedDb.anyFirst),
    many: wrapErrorLog(unwrappedDb.many),
    manyFirst: wrapErrorLog(unwrappedDb.manyFirst),
    maybeOne: wrapErrorLog(unwrappedDb.maybeOne),
    maybeOneFirst: wrapErrorLog(unwrappedDb.maybeOneFirst),
    one: wrapErrorLog(unwrappedDb.one),
    oneFirst: wrapErrorLog(unwrappedDb.oneFirst),
    query: wrapErrorLog(unwrappedDb.query),
    transaction: wrapErrorLog(unwrappedDb.transaction),
    exists: wrapErrorLog(unwrappedDb.exists),
  };

  return wrappedDb;
}

export type CreateDbPoolConfig = { dbIamAuth: boolean; tls: boolean } & Pick<
  AppConfig,
  'dbConfig'
>;

export function appConfigToDbConfig(
  config: CreateDbPoolSpec,
): CreateDbPoolConfig {
  return {
    dbIamAuth: config.environment !== 'local',
    tls: config.environment !== 'local',
    dbConfig: config.dbConfig,
  };
}

export type CreateDbPoolSpec = Pick<AppConfig, 'environment' | 'dbConfig'>;

export async function createDbPool(appConfig: CreateDbPoolSpec) {
  return createDbPoolCustom(appConfigToDbConfig(appConfig));
}

export async function createDbPoolCustom(
  config: CreateDbPoolConfig,
): Promise<DatabasePool> {
  return createPool(config.dbConfig.databaseUrl, {
    interceptors: [...createInterceptors()],
    typeParsers: [
      {
        name: 'timestamp',
        parse: (value) => (value === null ? value : new Date(`${value}Z`)),
      },
      {
        name: 'date',
        parse: (value) => (value === null ? value : new Date(`${value}Z`)),
      },
      {
        name: 'int8',
        parse: (value) => (value === null ? value : Number(value)),
      },
      {
        name: 'json',
        parse: (value) => (value === null ? value : JSON.parse(value)),
      },
    ],
  });
}

export async function waitForDb(db: CommonQueryMethods, timeoutMs: number) {
  const startTime = new Date().getTime();
  while (true) {
    try {
      await db.one(sql`SELECT 1;`);
      break;
    } catch (err) {
      const now = new Date().getTime();
      if (now - startTime > timeoutMs) {
        throw new Error(err);
      } else {
        logger.info('Waiting for DB...');
        await sleep(500);
      }
    }
  }
}

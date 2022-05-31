import {
  CommonQueryMethods,
  DatabasePool,
  DatabaseTransactionConnection,
  IntegrityConstraintViolationError,
  createPool,
  sql,
} from 'slonik';
import { createInterceptors } from 'slonik-interceptor-preset';

import { sleep } from '@libs/utils/common';
import { AppConfig } from '@libs/utils/config';
import logger from '@libs/utils/logger';

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

export function toConnectionString(config: {
  database?: string;
  host?: string;
  password?: string;
  port?: number;
  user?: string;
  ssl?: boolean;
}) {
  const connString = [
    'postgres://',
    config.user,
    config.password ? ':' + config.password : '',
    '@',
    config.host || 'localhost',
    ':',
    config.port || 5432,
    '/',
    config.database,
    '?',
    config.ssl ? `ssl=true&sslmode=require` : '',
  ].join('');
  return connString;
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
  const connectionConfiguration = {
    host: config.dbConfig.host,
    user: config.dbConfig.user,
    port: Number(config.dbConfig.port),
    database: config.dbConfig.database,
    password: config.dbConfig.password as string, // Slonik types are not up to date with pg client capabilities
    ...(config.tls
      ? { ssl: true, sslmode: 'require', allowCleartextPasswords: 1 }
      : {}),
  };

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

// async function getIamRdsToken(
//   config: Pick<AppConfig, 'awsRegion' | 'dbConfig'>,
// ): Promise<string> {
//   logger.debug('Using iam auth', {});

//   const signer = new RDS.Signer();

//   return await new Promise<string>((resolve, reject) => {
//     signer.getAuthToken(
//       {
//         region: config.awsRegion,
//         hostname: config.dbConfig.host,
//         port: parseInt(config.dbConfig.port),
//         username: config.dbConfig.user,
//       },
//       (err, token) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(token);
//         }
//       },
//     );
//   });
// }

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

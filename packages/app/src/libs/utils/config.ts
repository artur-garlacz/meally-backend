import {
  IsIn,
  IsNotEmpty,
  IsObject,
  IsPort,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { createEnvReader, Environment, getEnv } from './env';
import { transformToClass, transformToClassUnsafe } from './validation';

export async function getAppConfig(): Promise<AppConfig> {
  const envReader = createEnvReader(process.env);
  const { readOptionalString } = envReader;

  return transformToClass(AppConfig, {
    environment: getEnv('ENV') || 'local',
    appUrl: readOptionalString('APP_URL', 'no-url'),
    awsRegion: readOptionalString('AWS_REGION', 'eu-west-1'),
    appVersion: readOptionalString('APP_VERSION', 'no-version-env'), // cannot use env readers fns with webpack DefineModule
    dbConfig: readDbConfig(),
    cognitoConfig: readCognitoConfig(),
  });
}

export class AppConfig {
  @IsString()
  @IsIn(Object.values(Environment))
  readonly environment: Environment;

  @IsString()
  readonly appVersion: string;

  @IsString()
  readonly awsRegion: string;

  @IsString()
  readonly appUrl: string;

  @IsObject()
  @ValidateNested()
  @Type(() => DbConfig)
  readonly dbConfig: DbConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => CognitoConfig)
  readonly cognitoConfig: CognitoConfig;
}

export function getDbConfig(): Promise<DbConfig> {
  return transformToClassUnsafe(DbConfig, readDbConfig());
}

function readDbConfig(): DbConfig {
  const { readOptionalString } = createEnvReader();
  const host = readOptionalString('POSTGRES_HOST', 'localhost');
  const port = readOptionalString('POSTGRES_PORT', '5432');
  const database = readOptionalString('POSTGRES_DB', 'meally');
  const user = readOptionalString('POSTGRES_USER', 'lambda');
  const password = readOptionalString('POSTGRES_PASSWORD', 'changeme');
  const databaseUrl = `postgresql://${user}:${password}@${host}:${port}/${database}`;

  return {
    host,
    port,
    database,
    user,
    password,
    databaseUrl,
  };
}

export class DbConfig {
  @IsString()
  readonly host: string;

  @IsPort()
  readonly port: string;

  @IsString()
  readonly database: string;

  @IsString()
  readonly user: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly databaseUrl: string;
}

function readCognitoConfig(): CognitoConfig {
  const { readOptionalString } = createEnvReader(process.env);
  return {
    userPoolId: readOptionalString(
      'AWS_COGNITO_USER_POOL_ID',
      'no-cognito-user-pool',
    ),
  };
}
export class CognitoConfig {
  @IsString()
  @IsNotEmpty()
  readonly userPoolId: string;
}

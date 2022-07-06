import {
  IsIn,
  IsObject,
  IsPort,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { createEnvReader, Environment, getEnv } from './env';
import {
  transformToClass,
  transformToClassUnsafe,
} from '@lib/utils/validation';

export async function getAppConfig(): Promise<AppConfig> {
  const envReader = createEnvReader(process.env);
  const { readOptionalString } = envReader;

  return transformToClass(AppConfig, {
    environment: getEnv('ENV') || 'local',
    appUrl: readOptionalString('APP_URL', 'no-url'),
    dbConfig: readDbConfig(),
    queueConfig: readQueueConfig(),
    mailConfig: getMailConfig(),
  });
}

export class AppConfig {
  @IsString()
  @IsIn(Object.values(Environment))
  readonly environment: Environment;

  @IsString()
  readonly appUrl: string;

  @IsObject()
  readonly dbConfig: DbConfig;

  @IsObject()
  readonly queueConfig: QueueConfig;

  @IsObject()
  readonly mailConfig: MailConfig;
}

export function getDbConfig(): Promise<DbConfig> {
  return transformToClassUnsafe(DbConfig, readDbConfig());
}

function readDbConfig(): DbConfig {
  const { readOptionalString } = createEnvReader();
  const host = readOptionalString('POSTGRES_HOST', 'localhost');
  const port = readOptionalString('POSTGRES_PORT', 5432) as number;
  const database = readOptionalString('POSTGRES_DB', 'meally_notify');
  const user = readOptionalString('POSTGRES_USER', 'notify');
  const password = readOptionalString('POSTGRES_PASSWORD', 'notify');
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
  readonly port: number;

  @IsString()
  readonly database: string;

  @IsString()
  readonly user: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly databaseUrl: string;
}

export class QueueConfig {
  @IsString()
  readonly host: string;

  @IsPort()
  readonly port: string;
}

function readQueueConfig(): QueueConfig {
  const { readOptionalString } = createEnvReader(process.env);
  return {
    host: readOptionalString('QUEUE_HOST', 'localhost'),
    port: readOptionalString('QUEUE_PORT', '5672'),
  };
}

export class MailConfig {
  @IsString()
  readonly fromEmail: string;

  @IsString()
  readonly toEmail: string;

  @IsString()
  readonly gmailUser: string;

  @IsString()
  readonly gmailPassword: string;

  @IsString()
  readonly host: string;

  @IsPort()
  readonly port: string;
}

function getMailConfig(): MailConfig {
  const { readOptionalString } = createEnvReader(process.env);
  return {
    fromEmail: readOptionalString('FROM_EMAIL', 'localhost'),
    toEmail: readOptionalString('TO_EMAIL', 'localhost'),
    gmailUser: getEnv('MAIL_USER'),
    gmailPassword: getEnv('MAIL_PASSWORD'),
    host: readOptionalString('SMTP_HOST', 'localhost'),
    port: readOptionalString('SMTP_PORT', '5672'),
  };
}

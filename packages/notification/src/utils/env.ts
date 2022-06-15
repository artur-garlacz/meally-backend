export enum Environment {
  local = 'local',
  dev = 'dev',
  prod = 'prod',
  test = 'test',
}

type NameToType = {
  readonly ENV: Environment;
  readonly POSTGRES_USER: string;
  readonly POSTGRES_PASSWORD: string;
  readonly POSTGRES_DB: string;
  readonly POSTGRES_PORT: number;
  readonly APP_PORT: number;
};

export function getEnv<Env extends keyof NameToType>(
  name: Env,
): NameToType[Env];
export function getEnv(name: keyof NameToType): NameToType[keyof NameToType] {
  const val = process.env[name];

  if (!val) {
    throw new Error(`Cannot find environmental variable: ${name}`);
  }

  return val;
}

export function createEnvReader(
  envs: { [key: string]: string | undefined } = process.env,
) {
  function toInt(variable: string, value: string): number {
    const int = parseInt(value, 10);
    if (!Number.isFinite(int)) {
      throw new Error(
        `Expected integer for environment env: ${variable} but got ${value}`,
      );
    }
    return int;
  }

  function toBool(variable: string, value: string): boolean {
    switch (value.toLowerCase()) {
      case 'true':
      case 't':
      case '1':
        return true;
      case 'false':
      case 'f':
      case '0':
        return false;
      default:
        throw new Error(
          `Expected boolean for environment env: ${variable} but got ${value}`,
        );
    }
  }

  return Object.freeze({
    readOptionalString<T>(variable: string, fallback: T): string | T {
      const value = envs[variable];
      return value === undefined ? fallback : value;
    },

    readRequiredString(variable: string): string {
      const value = envs[variable];
      if (value === undefined) {
        throw new Error(`Missing environment env: ${variable}`);
      }
      return value;
    },

    readOptionalInt<T>(variable: string, fallback: T): number | T {
      const value = envs[variable];
      if (value === undefined) {
        return fallback;
      }
      return toInt(variable, value);
    },

    readRequiredInt(variable: string): number {
      const value = envs[variable];
      if (value === undefined) {
        throw new Error(`Missing environment env: ${variable}`);
      }
      return toInt(variable, value);
    },

    readOptionalBool<T>(variable: string, fallback: T): boolean | T {
      const value = envs[variable];
      if (value === undefined) {
        return fallback;
      }
      return toBool(variable, value);
    },

    readRequiredBool(variable: string): boolean {
      const value = envs[variable];
      if (value === undefined) {
        throw new Error(`Missing environment env: ${variable}`);
      }
      return toBool(variable, value);
    },
  });
}

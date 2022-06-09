import { ClassConstructor, plainToClass } from 'class-transformer';
import { ValidateIf, ValidatorOptions, validate } from 'class-validator';

import logger from './logger';

const defaultValidatorOptions = { whitelist: true, groups: undefined };

export async function transformToClass<T extends object>(
  classType: ClassConstructor<T>,
  plain: T,
  options: ValidatorOptions = defaultValidatorOptions,
): Promise<T> {
  try {
    const obj = plainToClass<T, T>(classType, plain);

    const errors = await validate(obj, {
      ...options,
      validationError: { target: false, value: false },
    });
    if (errors.length > 0) {
      throw new Error(`TransformError: ${classType.name}`);
    }
    return obj;
  } catch (e) {
    logger.error('Transform error', { error: e });
    throw e;
  }
}

export function transformToClassUnsafe<T extends object>(
  classType: ClassConstructor<T>,
  plain: object,
  options: ValidatorOptions = defaultValidatorOptions,
): Promise<T> {
  return transformToClass<T>(classType, plain as T, options);
}

export function IsNullable() {
  return function (obj: object, propertyName: string) {
    ValidateIf((o) => o[propertyName] !== null)(obj, propertyName);
  };
}

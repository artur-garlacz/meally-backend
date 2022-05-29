import { ClassConstructor } from 'class-transformer';
import { ValidatorOptions } from 'class-validator';
import {
  QueryResult,
  QueryResultRow,
  sql,
  TaggedTemplateLiteralInvocation,
  ValueExpression,
} from 'slonik';
import { serializeDate } from './serialization';
import { transformToClassUnsafe } from './validation';

export const toMany =
  <T extends object>(
    classType: ClassConstructor<T>,
    options?: ValidatorOptions,
  ) =>
  (result: QueryResult<object>) =>
    Promise.all(
      result.rows.map((row) => transformToClassUnsafe(classType, row, options)),
    );

export const toRequired =
  <T extends object>(
    classType: ClassConstructor<T>,
    options?: ValidatorOptions,
  ) =>
  (row: object) =>
    transformToClassUnsafe(classType, row, options);

export const toOptional =
  <T extends object>(
    classType: ClassConstructor<T>,
    options?: ValidatorOptions,
  ) =>
  (row: object | null) =>
    row ? transformToClassUnsafe(classType, row, options) : null;

export function normalizeValue(
  value: string | string[] | number | Date | boolean | undefined | null,
): ValueExpression {
  if (value instanceof Date) {
    return serializeDate(value);
  } else if (Array.isArray(value)) {
    return sql.array(value, 'text');
  } else {
    return value || null;
  }
}

export type NamedAssignmentPayloadType = {
  [key: string]: string | string[] | number | Date | boolean | undefined | null;
};

export function chainOptional<T extends NamedAssignmentPayloadType>(
  namedAssignment: T,
  type: 'update' | 'select',
) {
  const queries: Array<TaggedTemplateLiteralInvocation<QueryResultRow>> = [];
  Object.entries(namedAssignment).forEach(([column, value]) => {
    if (value === undefined) return;
    const normalizedValue = normalizeValue(value);
    queries.push(sql`${sql.identifier([column])} = ${normalizedValue}`);
  });

  if (type === 'select') {
    return !!queries.length ? sql.join(queries, sql` AND `) : sql`1=1`;
  }

  return sql.join(queries, sql`, `);
}

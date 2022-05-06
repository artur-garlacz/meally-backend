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

export function chainOptional(
  namedAssignment: NamedAssignmentPayloadType,
  type: 'update' | 'select',
) {
  const queries: Array<TaggedTemplateLiteralInvocation<QueryResultRow>> = [];
  Object.entries(namedAssignment).forEach(([column, value]) => {
    if (value === undefined) return;
    const normalizedValue = normalizeValue(value);
    queries.push(sql`${sql.identifier([column])} = ${normalizedValue}`);
  });
  return sql.join(queries, type === 'select' ? sql`AND` : sql`, `);
}

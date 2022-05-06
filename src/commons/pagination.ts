import { sql } from 'slonik';

export type PaginationResponse<T> = {
  items: T[];
  itemsCount: number;
} & PaginationRequest;

export type PaginationRequest = {
  page: number;
  perPage: number;
};

export function setPaginationQuery({ page, perPage }: PaginationRequest) {
  const offset = page === 1 ? 0 : page * perPage - perPage;

  return sql`LIMIT ${perPage} OFFSET ${offset}`;
}

export function setPaginationResponse<T>({
  items,
  page,
  perPage,
}: {
  items: T[];
  page: number;
  perPage: number;
}): PaginationResponse<T> {
  return {
    items,
    itemsCount: items.length,
    perPage,
    page,
  };
}

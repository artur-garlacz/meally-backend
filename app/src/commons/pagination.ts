import { sql } from 'slonik';

import { chainOptional } from '@libs/utils/query';

export type PaginationResponse<T> = {
  items: T[];
  itemsCount: number;
} & PaginationRequest;

export type PaginationRequest = {
  page: number;
  perPage: number;
};

export type PaginationRequestQueryString = {
  page: string;
  perPage: string;
};

export type GetItemsRequestQuery<T> = T & Partial<PaginationRequestQueryString>;

export type ItemsFilterQuery<T> = T & Partial<PaginationRequest>;

export function setPaginationParams<
  T extends Partial<PaginationRequestQueryString>,
>({ page, perPage, ...args }: T) {
  const pageNumber = Number(page || 1);
  const perPageNumber = Number(perPage || 10);
  return {
    paginateCondition: setPaginationQuery({
      page: pageNumber,
      perPage: perPageNumber,
    }),
    whereCondition: chainOptional(args as T, 'select'),
    page: pageNumber,
    perPage: perPageNumber,
  };
}

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

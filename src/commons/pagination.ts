export type PaginationResponse<T> = {
  itemsCount: number;
  items: T[];
  totalPages: number;
  currentPage: number;
};

export type PaginationRequest = {
  pagination: {
    page: number;
    limit: number;
  };
};

export function setPaginationResponse<T>({
  items,
  page,
}: {
  items: T[];
  page?: number;
}) {
  return {
    items,
    itemsCount: items.length,
    page,
  };
}

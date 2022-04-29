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

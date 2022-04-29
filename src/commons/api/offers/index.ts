import { PaginationRequest } from '@commons/pagination';

export type OfferFilterQuery = {
  categoryId: string;
  price: {
    from: number;
    to: number;
  };
  title: string;
} & PaginationRequest;

export enum OfferStatus {
  Draft = 'draft',
}
